import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		example: 'cooldev',
		required: true,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: 'aXK]ndh?',
		required: true,
	})
	@IsNotEmpty()
	password: string;
}
