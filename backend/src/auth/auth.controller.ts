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
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from 'src/decorators/public.decorator';
import { GoogleGuard } from './guards/google.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	async register(@Body() dto: RegisterDto): Promise<void> {
		return this.authService.register(dto);
	}

	@Public()
	@UseGuards(LocalGuard)
	@HttpCode(200)
	@Post('login')
	async login(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.login(user, res);
	}

	@Public()
	@Get('google')
	@UseGuards(GoogleGuard)
	async googleAuth(@Req() req: Request) {}

	@Public()
	@Get('google/callback')
	@UseGuards(GoogleGuard)
	googleAuthRedirect(@GetUser() user: User, @Res() res: Response) {
		return this.authService.login(user, res);
	}

	@Public()
	@HttpCode(200)
	@Post('logout')
	async logout(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		return this.authService.logout(user, res);
	}

	@Public()
	@HttpCode(200)
	@Post('verify')
	async sendVerificationMail(@Body() dto: ForgotPasswordDto): Promise<void> {
		return this.authService.sendVerificationMail(dto.email);
	}

	@Public()
	@Get('verify/:token')
	async verify(@Param('token') token: string): Promise<void> {
		return this.authService.verify(token);
	}

	@Public()
	@UseGuards(JwtRefreshGuard)
	@Post('refresh-token')
	async refresh(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<any> {
		const { accessToken, refreshToken } =
			await this.authService.refreshTokens(user.id);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
		});

		return { token: accessToken };
	}

	@Public()
	@Post('forgot-password')
	@HttpCode(200)
	async sendResetMail(@Body() { email }: ForgotPasswordDto): Promise<void> {
		return this.authService.sendResetMail(email);
	}

	@Public()
	@Post('password-reset/:token')
	async resetPassword(
		@Param('token') token: string,
		@Body() { password }: ResetPasswordDto,
	): Promise<void> {
		return this.authService.resetPassword(token, password);
	}
}
