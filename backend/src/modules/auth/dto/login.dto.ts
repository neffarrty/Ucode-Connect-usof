import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		description: 'The email of user',
		type: String,
		example: 'john.smith@example.com',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'The password of user',
		type: String,
		example: 'E08ev2SI',
	})
	@IsNotEmpty()
	password: string;
}
