import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({
		description: 'The new password of user',
		type: String,
		example: 'd0uawHPv',
	})
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
		message: 'Password is not strong enough',
	})
	password: string;
}
