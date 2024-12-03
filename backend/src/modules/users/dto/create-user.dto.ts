import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsInt,
	IsBoolean,
	IsEnum,
	Matches,
	IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
	@ApiProperty({
		description: 'User login, used for authentication',
		example: 'john.smith',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	login: string;

	@ApiProperty({
		description: 'Password for user authentication',
		example: 'E08ev2SI',
		type: String,
	})
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
		message: 'Password is not strong enough',
	})
	password: string;

	@ApiProperty({
		description: 'The firstname and surname of user',
		example: 'John Smith',
		type: String,
		required: false,
	})
	@IsString()
	@IsNotEmpty()
	fullname?: string;

	@ApiProperty({
		description: 'User email address',
		example: 'john.smith@example.com',
		type: String,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'URL to the user avatar image',
		example: 'https://example.com/avatar.jpg',
		type: String,
		required: false,
	})
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	avatar?: string;

	@ApiProperty({
		description: 'User rating score, indicating reputation',
		example: 150,
		type: Number,
		required: false,
	})
	@IsInt()
	@IsOptional()
	rating?: number;

	@ApiProperty({
		description: 'User role within the application',
		example: 'USER',
		type: String,
		enum: Role,
		required: false,
	})
	@IsEnum(Role)
	@IsOptional()
	role: Role = Role.USER;

	@ApiProperty({
		description: 'Indicates if the user’s email has been verified',
		example: true,
		type: Boolean,
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	verified: boolean = true;
}
