import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
	@ApiProperty({
		description: 'The email of user to send password reset email to',
		type: String,
		example: 'user@example.com',
	})
	@IsEmail()
	email: string;
}
