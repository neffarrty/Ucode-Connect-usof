import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
	ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto, AuthResponseDto } from './dto';
import { UserDto } from 'src/modules/users/dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { User } from '@prisma/client';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailerService,
	) {}

	async register({ login, email, password }: RegisterDto): Promise<void> {
		const candidate = await this.prisma.user.findFirst({
			where: {
				OR: [{ login }, { email }],
			},
		});

		if (candidate) {
			throw new ConflictException('User already exists');
		}

		const user = await this.prisma.user.create({
			data: {
				login,
				email,
				password: await bcrypt.hash(password, 10),
				avatar: process.env.DEFAULT_AVATAR_URL,
			},
		});

		this.sendVerificationMail(user.email);
	}

	async login(user: User, res: Response): Promise<AuthResponseDto> {
		const { accessToken, refreshToken } = await this.generateTokens({
			userId: user.id,
			email: user.email,
		});

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
		});

		return {
			user: new UserDto(user),
			token: accessToken,
		};
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

		await this.prisma.user.update({
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

		await this.prisma.user.update({
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

		const token = await this.generateAccessToken({
			userId: user.id,
			email: user.email,
		});

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
			const { userId } = this.jwtService.verify(token, {
				secret: this.configService.get<string>(
					'auth.jwt.access.secret',
				),
			});
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
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

	async generateAccessToken(payload: JwtPayload): Promise<string> {
		const secret = this.configService.get<string>('auth.jwt.access.secret');
		const exp = this.configService.get<string>(
			'auth.jwt.access.expiration',
		);

		return await this.jwtService.signAsync(payload, {
			secret: secret,
			expiresIn: exp,
		});
	}

	async generateRefreshToken(payload: JwtPayload): Promise<string> {
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

	async generateTokens(payload: JwtPayload): Promise<any> {
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		]);

		return { accessToken, refreshToken };
	}
}
