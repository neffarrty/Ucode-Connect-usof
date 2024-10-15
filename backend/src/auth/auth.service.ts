import {
	Injectable,
	ConflictException,
	BadRequestException,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailerService,
	) {}

	async register(dto: RegisterDto): Promise<any> {
		const candidate = await this.usersService.findByLogin(dto.login);

		if (candidate) {
			throw new ConflictException('Username already exists');
		}

		const user = await this.usersService.create({
			...dto,
			password: await bcrypt.hash(dto.password, 10),
		});

		this.sendVerificationMail(user.email);
	}

	async login(user: User, res: Response): Promise<any> {
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken({ sub: user.id }),
			this.generateRefreshToken({ sub: user.id }),
		]);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
		});

		return res.json({ user, token: accessToken });
	}

	async logout(user: User, res: Response): Promise<void> {
		res.clearCookie('refresh_token');
	}

	async verify(token: string): Promise<void> {
		const user = await this.usersService.findByVerifyToken(token);

		if (!user) {
			throw new BadRequestException('Invalid confirmation token');
		}

		this.usersService.update(user.id, {
			verified: true,
			verifyToken: null,
		});
	}

	async sendVerificationMail(email: string): Promise<void> {
		const user = await this.usersService.findByEmail(email);

		if (!user) {
			throw new UnauthorizedException('Email does not exists');
		}

		const token = uuid();

		this.usersService.update(user.id, {
			verifyToken: token,
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
		const user = await this.usersService.findByEmail(email);

		if (!user) {
			throw new UnauthorizedException('Invalid email');
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
			const user = await this.usersService.findById(sub);

			if (user) {
				const hash = await bcrypt.hash(password, 10);
				this.usersService.update(user.id, {
					password: hash,
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
		const user = await this.usersService.findByEmail(email);

		if (!user) {
			throw new BadRequestException('User does not exists');
		}
		if (!user.verified) {
			throw new UnauthorizedException('User is not verified');
		}
		if (!(await bcrypt.compare(password, user.password))) {
			throw new BadRequestException('Password does not match');
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

	async refreshTokens(userId: number): Promise<any> {
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken({ sub: userId }),
			this.generateRefreshToken({ sub: userId }),
		]);

		return { accessToken, refreshToken };
	}
}
