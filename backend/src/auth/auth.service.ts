import {
	Injectable,
	ConflictException,
	BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import { hash, compare } from 'bcrypt';

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
			password: await hash(dto.password, 10),
		});

		const token = this.jwtService.sign(
			{ sub: user.id },
			{
				secret: this.configService.get<string>(
					'auth.jwt.access.secret',
				),
				expiresIn: '15m',
			},
		);

		await this.mailService.sendMail({
			to: user.email,
			subject: 'Account verification',
			template: 'verification',
			context: {
				username: user.login,
				token: token,
			},
		});
	}

	async verify(token: string): Promise<any> {
		try {
			const { sub } = this.jwtService.verify(token);
			const user = await this.usersService.findById(sub);

			if (user) {
				this.usersService.update(user.id, {
					verified: true,
				});
			}
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new BadRequestException('Verification time is expired');
			}
			throw new BadRequestException('Invalid token');
		}
	}

	async login(user: User, res: Response): Promise<any> {
		const [access_token, refresh_token] = await Promise.all([
			this.generateAccessToken({ sub: user.id }),
			this.generateRefreshToken({ sub: user.id }),
		]);

		console.log(access_token);

		res.cookie('refresh_token', refresh_token, {
			httpOnly: true,
		});

		return res.json({ token: access_token });
	}

	async logout() {}

	async sendResetLink() {}

	async resetPassword(token: string, password: string) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findByEmail(email);

		if (!user) {
			throw new BadRequestException('User does not exists');
		}
		if (!(await compare(password, user.password))) {
			throw new BadRequestException('Password does not match');
		}

		return user;
	}

	async generateAccessToken(payload: any): Promise<string> {
		const secret = this.configService.get<string>('auth.jwt.access.secret');
		const exp = this.configService.get<string>(
			'auth.jwt.access.expiration',
		);

		console.log(exp);

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

		console.log(exp);

		return await this.jwtService.signAsync(payload, {
			secret: secret,
			expiresIn: exp,
		});
	}
}
