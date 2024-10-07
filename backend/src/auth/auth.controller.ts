import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Post('login')
	async login() {}

	@Post('logout')
	async logout() {}

	@Post('password-reset')
	async sendResetLink() {}

	@Post('password-reset/:token')
	async resetPassword(
		@Param('token') token: string,
		@Body() body: { password: string },
	) {}
}
