import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({
		description: 'The new password of user',
		type: String,
		example: 'd0uawHPv',
	})
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
	})
	password: string;
}
