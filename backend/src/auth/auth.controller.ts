import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Get('activate/:token')
	async activate(@Param('token') token: string) {
		return this.authService.activate(token);
	}

	@Post('login')
	async login() {
		return this.authService.login();
	}

	@Post('logout')
	async logout() {
		return this.authService.logout();
	}

	@Post('password-reset')
	async sendResetLink() {}

	@Post('password-reset/:token')
	async resetPassword(
		@Param('token') token: string,
		@Body() body: { password: string },
	) {}
}
