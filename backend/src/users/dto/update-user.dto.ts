import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	IsBoolean,
	IsInt,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsString()
	@IsNotEmpty()
	login?: string;

	@Matches(/^[]$/)
	password?: string;

	@IsString()
	@IsNotEmpty()
	fullname?: string;

	@IsEmail()
	email?: string;

	@IsString()
	@IsNotEmpty()
	avatar?: string;

	@IsInt()
	rating?: number;

	role?: Role;

	@IsBoolean()
	verified?: boolean;
}
