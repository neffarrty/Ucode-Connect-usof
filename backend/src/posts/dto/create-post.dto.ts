import { ApiProperty } from '@nestjs/swagger';
import { Category, Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	@IsOptional()
	@IsEnum(Status)
	status?: Status;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;

	// @ApiProperty()
	// @IsOptional()
	// categories?: Category[];
}
