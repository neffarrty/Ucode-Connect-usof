import {
	IsNotEmpty,
	Length,
	IsEmail,
	Matches,
	IsOptional,
} from 'class-validator';

export class RegisterDto {
	@IsNotEmpty()
	@Length(5, 20)
	login: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/)
	password: string;

	@Length(5, 32)
	@IsOptional()
	fullname: string;
}
