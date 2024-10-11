import {
	Controller,
	Post,
	Get,
	HttpCode,
	Body,
	Param,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local.guard';
import { ReqUser } from './decorators/req-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Get('verify/:token')
	async verify(@Param('token') token: string) {
		return this.authService.verify(token);
	}

	@Post('login')
	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	async login(@ReqUser() user: User, @Res() res: Response) {
		return this.authService.login(user, res);
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
