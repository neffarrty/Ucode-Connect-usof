import {
	Controller,
	Get,
	Post,
	HttpCode,
	Body,
	Param,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConflictResponse,
	ApiExcludeEndpoint,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserDto } from 'src/users/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiBody({
		type: [RegisterDto],
	})
	@ApiOkResponse({
		description: 'Registration successful',
	})
	@ApiBadRequestResponse({
		description: 'Invalid credentials',
	})
	@ApiConflictResponse({
		description: 'User already exists',
	})
	async register(@Body() dto: RegisterDto): Promise<void> {
		return this.authService.register(dto);
	}

	@Public()
	@Post('login')
	@HttpCode(200)
	@UseGuards(LocalGuard)
	@ApiOperation({ summary: 'Authenticate with email and password' })
	@ApiBody({
		type: [LoginDto],
	})
	@ApiOkResponse({
		type: AuthResponseDto,
	})
	@ApiBadRequestResponse({
		description: 'Invalid credentials',
	})
	@ApiUnauthorizedResponse({
		description: "User doesn't exists or passwords doesn't match",
	})
	async login(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<AuthResponseDto> {
		return this.authService.login(user, res);
	}

	@Public()
	@Get('google')
	@UseGuards(GoogleGuard)
	@ApiOperation({ summary: 'Authenticate with Google' })
	@ApiOkResponse({
		description: 'Redirects to Google for authentication',
	})
	async googleAuth(@Req() req: Request) {}

	@Public()
	@Get('google/callback')
	@UseGuards(GoogleGuard)
	@ApiExcludeEndpoint()
	async googleAuthRedirect(@GetUser() user: User, @Res() res: Response) {
		return this.authService.login(user, res);
	}

	@Public()
	@HttpCode(200)
	@Post('logout')
	@ApiOperation({ summary: 'Logout the user' })
	@ApiOkResponse({
		description: 'Logout successful',
	})
	async logout(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		return this.authService.logout(user, res);
	}

	@Public()
	@HttpCode(200)
	@Post('verify')
	@ApiOperation({ summary: 'Send verification email' })
	@ApiBody({
		type: [ForgotPasswordDto],
		description: 'Email to send verification',
	})
	@ApiOkResponse({
		description: 'Verification email sent',
	})
	@ApiUnauthorizedResponse({
		description: "User with provided email doen't exists",
	})
	async sendVerificationMail(@Body() dto: ForgotPasswordDto): Promise<void> {
		return this.authService.sendVerificationMail(dto.email);
	}

	@Public()
	@Get('verify/:token')
	@ApiOperation({ summary: 'Verify email with token' })
	@ApiOkResponse({
		description: 'Email verification successful',
	})
	@ApiBadRequestResponse({
		description: 'Invalid or expired token',
	})
	async verify(@Param('token') token: string): Promise<void> {
		return this.authService.verify(token);
	}

	@Public()
	@Post('refresh-token')
	@UseGuards(JwtRefreshGuard)
	@ApiOperation({ summary: 'Refresh access token' })
	@ApiOkResponse({
		type: AuthResponseDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid refresh token',
	})
	async refresh(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<AuthResponseDto> {
		const { accessToken, refreshToken } =
			await this.authService.generateTokens(user.id);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
		});

		return {
			user: new UserDto(user),
			token: accessToken,
		};
	}

	@Public()
	@Post('forgot-password')
	@HttpCode(200)
	@ApiOperation({ summary: 'Send reset password email' })
	@ApiBody({
		type: [ForgotPasswordDto],
		description: 'Email to send reset password link',
	})
	@ApiOkResponse({
		description: 'Reset password email sent',
	})
	@ApiUnauthorizedResponse({
		description: "User with provided email doen't exists",
	})
	async sendResetMail(@Body() { email }: ForgotPasswordDto): Promise<void> {
		return this.authService.sendResetMail(email);
	}

	@Public()
	@Post('password-reset/:token')
	@ApiOperation({ summary: 'Reset password' })
	@ApiParam({ name: 'token', required: true, description: 'Reset token' })
	@ApiBody({
		type: [ResetPasswordDto],
		description: 'New password',
	})
	@ApiOkResponse({
		description: 'Password reset successful',
	})
	@ApiBadRequestResponse({
		description: 'Invalid reset token or password',
	})
	async resetPassword(
		@Param('token') token: string,
		@Body() { password }: ResetPasswordDto,
	): Promise<void> {
		return this.authService.resetPassword(token, password);
	}
}
