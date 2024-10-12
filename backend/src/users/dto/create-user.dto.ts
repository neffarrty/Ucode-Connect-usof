import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsInt,
	IsBoolean,
	IsStrongPassword,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	login: string;

	@ApiProperty()
	@IsStrongPassword()
	password: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	fullname?: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	avatar?: string;

	@ApiProperty()
	@IsInt()
	rating?: number;

	role?: Role;

	@IsBoolean()
	verified?: boolean;

	@IsString()
	verifyToken?: string;
}
