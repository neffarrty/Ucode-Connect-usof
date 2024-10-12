import {
	Controller,
	Post,
	Get,
	HttpCode,
	Body,
	Param,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegisterDto): Promise<void> {
		return this.authService.register(dto);
	}

	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	@Post('login')
	async login(@GetUser() user: User, @Res() res: Response) {
		return this.authService.login(user, res);
	}

	@HttpCode(200)
	@Post('logout')
	async logout() {
		return this.authService.logout(null, null);
	}

	@HttpCode(200)
	@Post('verify')
	async sendVerificationMail(@Body() dto: ForgotPasswordDto) {
		return this.authService.sendVerificationMail(dto.email);
	}

	@Get('verify/:token')
	async verify(@Param('token') token: string) {
		return this.authService.verify(token);
	}

	@UseGuards(JwtRefreshAuthGuard)
	@Post('refresh')
	async refresh(@Req() req: Request) {
		return this.authService.refresh();
	}

	@Post('forgot-password')
	@HttpCode(200)
	async sendResetMail(@Body() dto: ForgotPasswordDto): Promise<void> {
		return this.authService.sendResetMail(dto.email);
	}

	@Post('password-reset/:token')
	async resetPassword(
		@Param('token') token: string,
		@Body() dto: ResetPasswordDto,
	): Promise<void> {
		return this.authService.resetPassword(token, dto.password);
	}
}
