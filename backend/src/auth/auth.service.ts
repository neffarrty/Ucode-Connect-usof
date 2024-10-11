import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailerService,
	) {}

	async register(dto: RegisterDto): Promise<any> {
		const candidate = await this.usersService.findByLogin(dto.login);

		if (candidate) {
			throw new BadRequestException('Username already exists');
		}

		const user = await this.usersService.create({
			...dto,
			password: await bcrypt.hash(dto.password, 10),
		});

		await this.mailService.sendMail({
			to: user.email,
			subject: 'Account verification',
			template: 'verification',
			context: {
				username: user.login,
				token: this.jwtService.sign(
					{ sub: user.id },
					{ expiresIn: '15m' },
				),
			},
		});

		// return {
		// 	access_token: this.jwtService.sign({
		// 		sub: user.id,
		// 		login: user.login,
		// 	}),
		// 	user: {
		// 		login: user.login,
		// 		email: user.email,
		// 	},
		// };
	}

	async verify(token: string): Promise<any> {
		try {
			const { id } = this.jwtService.verify(token);
			const user = this.usersService.findById(id);
		} catch (error) {
			if (error instanceof TokenExpiredError) console.log(error);
		}
	}

	async login() {}

	async logout() {}

	async sendResetLink() {}

	async resetPassword(token: string, password: string) {}
}
