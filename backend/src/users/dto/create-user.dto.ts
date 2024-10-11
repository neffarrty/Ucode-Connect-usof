import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	Matches,
} from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		example: 'cooldev',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	login: string;

	@ApiProperty({
		example: 'cool.dev@example.com',
		required: true,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: 'aXK]ndh?',
		required: true,
	})
	@IsStrongPassword()
	password: string;
}
