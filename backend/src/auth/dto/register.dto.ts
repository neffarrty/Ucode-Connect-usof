import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	Length,
	IsEmail,
	Matches,
	IsOptional,
} from 'class-validator';

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(5, 20)
	login: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/)
	password: string;

	@ApiProperty()
	@Length(5, 32)
	fullname?: string;
}
