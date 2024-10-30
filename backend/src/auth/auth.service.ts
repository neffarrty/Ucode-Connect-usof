import {
	Injectable,
	ConflictException,
	BadRequestException,
	UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailerService,
	) {}

	async register(dto: RegisterDto): Promise<any> {
		const candidate = await this.prisma.user.findFirst({
			where: {
				OR: [{ login: dto.login }, { email: dto.email }],
			},
		});

		if (candidate) {
			throw new ConflictException('User already exists');
		}

		const user = await this.prisma.user.create({
			data: {
				...dto,
				password: await bcrypt.hash(dto.password, 10),
			},
		});

		this.sendVerificationMail(user.email);
	}

	async login(user: User, res: Response): Promise<any> {
		const { accessToken, refreshToken } = await this.generateTokens(
			user.id,
		);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
		});

		return { token: accessToken };
	}

	async logout(user: User, res: Response): Promise<void> {
		res.clearCookie('refresh_token');
	}

	async verify(token: string): Promise<void> {
		const user = await this.prisma.user.findUnique({
			where: {
				verifyToken: token,
			},
		});

		if (!user) {
			throw new BadRequestException('Invalid confirmation token');
		}

		this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				verified: true,
				verifyToken: null,
			},
		});
	}

	async sendVerificationMail(email: string): Promise<void> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException(
				`User with email '${email}' does not exists`,
			);
		}

		const token = uuid();

		this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				verifyToken: token,
			},
		});

		await this.mailService.sendMail({
			to: user.email,
			subject: 'Account verification',
			template: 'verification',
			context: {
				username: user.login,
				token,
			},
		});
	}

	async sendResetMail(email: string): Promise<void> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException(
				`User with email '${email}' does not exists`,
			);
		}

		const token = await this.generateAccessToken({ sub: user.id });

		await this.mailService.sendMail({
			to: user.email,
			subject: 'Password reset',
			template: 'reset-password',
			context: {
				username: user.login,
				token,
			},
		});
	}

	async resetPassword(token: string, password: string) {
		try {
			const { sub } = this.jwtService.verify(token, {
				secret: this.configService.get<string>(
					'auth.jwt.access.secret',
				),
			});
			const user = await this.prisma.user.findUnique({
				where: { id: sub },
			});

			if (user) {
				const hash = await bcrypt.hash(password, 10);
				this.prisma.user.update({
					where: { id: user.id },
					data: {
						password: hash,
					},
				});
			}
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new BadRequestException(
					'Time for password reset is expired',
				);
			}
			throw new BadRequestException(error.message);
		}
	}

	async validateUser(email: string, password: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException(
				`User with email '${email}' does not exists`,
			);
		}
		if (!user.verified) {
			throw new UnauthorizedException('User is not verified');
		}
		if (!(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException('Password does not match');
		}

		return user;
	}

	async generateAccessToken(payload: any): Promise<string> {
		const secret = this.configService.get<string>('auth.jwt.access.secret');
		const exp = this.configService.get<string>(
			'auth.jwt.access.expiration',
		);

		return await this.jwtService.signAsync(payload, {
			secret: secret,
			expiresIn: exp,
		});
	}

	async generateRefreshToken(payload: any): Promise<string> {
		const secret = this.configService.get<string>(
			'auth.jwt.refresh.secret',
		);
		const exp = this.configService.get<string>(
			'auth.jwt.refresh.expiration',
		);

		return await this.jwtService.signAsync(payload, {
			secret: secret,
			expiresIn: exp,
		});
	}

	async generateTokens(userId: number): Promise<any> {
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken({ sub: userId }),
			this.generateRefreshToken({ sub: userId }),
		]);

		return { accessToken, refreshToken };
	}
}
