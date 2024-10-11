import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	IsBoolean,
	IsInt,
	IsStrongPassword,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty({
		example: 'cooldev',
		required: false,
	})
	@IsString()
	@IsNotEmpty()
	login?: string;

	@ApiProperty({
		example: 'aXK]ndh?',
		required: false,
	})
	@IsStrongPassword()
	password?: string;

	@ApiProperty({
		example: 'john Smith',
		required: false,
	})
	@IsString()
	@IsNotEmpty()
	fullname?: string;

	@ApiProperty({
		example: 'cool.dev@example.com',
		required: false,
	})
	@IsEmail()
	email?: string;

	@ApiProperty({
		example: 'img/dev.png',
		required: false,
	})
	@IsString()
	@IsNotEmpty()
	avatar?: string;

	@ApiProperty({
		example: 1488,
		required: false,
	})
	@IsInt()
	rating?: number;

	role?: Role;

	@IsBoolean()
	verified?: boolean;
}
