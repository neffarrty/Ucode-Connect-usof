import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	Length,
	IsEmail,
	IsString,
	IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
	@ApiProperty({
		description: 'The login of user',
		example: 'john.smith',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	@Length(5, 20)
	login: string;

	@ApiProperty({
		description: 'The email of user',
		example: 'john.smith@example.com',
		type: String,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'The password of user',
		example: 'E08ev2SI',
		type: String,
	})
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
	})
	password: string;

	@ApiProperty({
		description: 'The firstname and surname of user',
		type: String,
		example: 'John Smith',
		required: false,
	})
	@Length(5, 32)
	fullname?: string;
}
