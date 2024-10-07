import {
	Injectable,
	ConflictException,
	UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwt: JwtService,
	) {}

	// TODO: check for email existence
	async register(dto: RegisterDto): Promise<any> {
		const candidate = await this.usersService.findByLogin(dto.login);

		if (candidate) {
			throw new UnauthorizedException('Username already exists');
		}

		const user = await this.usersService.create({
			...dto,
			password: await bcrypt.hash(dto.password, 10),
		});

		return {
			access_token: this.jwt.sign({ sub: user.id, login: user.login }),
			user: {
				login: user.login,
				email: user.email,
			},
		};
	}

	async login() {}

	async logout() {}

	async sendResetLink() {}

	async resetPassword(token: string, password: string) {}
}
