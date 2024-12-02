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
	HttpStatus,
	Header,
	Headers,
	UnauthorizedException,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiExcludeEndpoint,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
	RegisterDto,
	LoginDto,
	ForgotPasswordDto,
	ResetPasswordDto,
	AuthResponseDto,
} from './dto';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { GetUser, Public } from 'src/decorators';
import { Response } from 'express';
import { User } from '@prisma/client';
import { LocalGuard } from './guards/local.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GoogleGuard } from './guards/google.guard';
import { JwtGuard } from './guards/jwt.guard';
import { GithubGuard } from './guards/github.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly service: AuthService) {}

	@Get('self')
	@UseGuards(JwtGuard)
	@ApiOperation({ summary: 'Get current authentificated user' })
	@ApiUnauthorizedResponse({
		description: 'Not authenticated',
	})
	async getSelf(@GetUser() user: User): Promise<{ user: UserDto }> {
		return { user };
	}

	@Public()
	@Post('register')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiBody({
		type: RegisterDto,
	})
	@ApiCreatedResponse({
		description: 'Registration successful',
	})
	@ApiBadRequestResponse({
		description: 'Invalid credentials',
	})
	@ApiConflictResponse({
		description: 'User already exists',
	})
	async register(@Body() dto: RegisterDto): Promise<void> {
		return this.service.register(dto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalGuard)
	@ApiOperation({ summary: 'Authenticate with email and password' })
	@ApiBody({
		type: LoginDto,
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
		return this.service.login(user, res);
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
	async googleAuthRedirect(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	) {
		const { token } = await this.service.login(user, res);
		res.redirect(`http://localhost:3001/oauth-success/${token}`);
	}

	@Public()
	@Get('github')
	@UseGuards(GithubGuard)
	@ApiOperation({ summary: 'Authenticate with Github' })
	@ApiOkResponse({
		description: 'Redirects to Github for authentication',
	})
	async githubAuth(@Req() req: Request) {}

	@Public()
	@Get('github/callback')
	@UseGuards(GithubGuard)
	@ApiExcludeEndpoint()
	async githubAuthCallback(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	) {
		const { token } = await this.service.login(user, res);
		res.redirect(`http://localhost:3001/oauth-success/${token}`);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('logout')
	@ApiOperation({ summary: 'Logout the user' })
	@ApiNoContentResponse({
		description: 'Logout successful',
	})
	async logout(
		@Headers('Authorization') authHeader: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		const token = authHeader?.split(' ')[1];
		return this.service.logout(token, res);
	}

	@Public()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('verify')
	@ApiOperation({ summary: 'Send verification email' })
	@ApiBody({
		type: ForgotPasswordDto,
		description: 'Email to send verification',
	})
	@ApiNoContentResponse({
		description: 'Verification email sent',
	})
	@ApiUnauthorizedResponse({
		description: "User with provided email doen't exists",
	})
	async sendVerificationMail(@Body() dto: ForgotPasswordDto): Promise<void> {
		return this.service.sendVerificationMail(dto.email);
	}

	@Public()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('verify/:token')
	@ApiOperation({ summary: 'Verify email with token' })
	@ApiNoContentResponse({
		description: 'Email verification successful',
	})
	@ApiBadRequestResponse({
		description: 'Invalid or expired token',
	})
	async verify(@Param('token') token: string): Promise<void> {
		return this.service.verify(token);
	}

	@Public()
	@Post('refresh-tokens')
	@UseGuards(JwtRefreshGuard)
	@ApiOperation({ summary: 'Refresh access token' })
	@ApiCreatedResponse({
		type: AuthResponseDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid refresh token',
	})
	async refresh(
		@GetUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<AuthResponseDto> {
		const { accessToken, refreshToken } = await this.service.generateTokens(
			{
				userId: user.id,
				email: user.email,
			},
		);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return {
			user: new UserDto(user),
			token: accessToken,
		};
	}

	@Public()
	@Post('forgot-password')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Send reset password email' })
	@ApiBody({
		type: ForgotPasswordDto,
		description: 'Email to send reset password link',
	})
	@ApiOkResponse({
		description: 'Reset password email sent',
	})
	@ApiUnauthorizedResponse({
		description: "User with provided email doen't exists",
	})
	async sendResetMail(@Body() { email }: ForgotPasswordDto): Promise<void> {
		return this.service.sendResetMail(email);
	}

	@Public()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('password-reset/:token')
	@ApiOperation({ summary: 'Reset password' })
	@ApiParam({ name: 'token', required: true, description: 'Reset token' })
	@ApiBody({
		type: ResetPasswordDto,
		description: 'New password',
	})
	@ApiNoContentResponse({
		description: 'Password reset successful',
	})
	@ApiBadRequestResponse({
		description: 'Invalid reset token or password',
	})
	async resetPassword(
		@Param('token') token: string,
		@Body() { password }: ResetPasswordDto,
	): Promise<void> {
		return this.service.resetPassword(token, password);
	}
}
