import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreatePostDto {
	@ApiProperty({
		description: 'Title of the post',
		example: 'Understanding Dependency Injection in TypeScript',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'Status of the post',
		example: 'ACTIVE',
		type: String,
		enum: Status,
	})
	@IsOptional()
	@IsEnum(Status)
	status?: Status;

	@ApiProperty({
		description: 'Main content of the post',
		example: 'Dependency Injection is a powerful design pattern that...',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty({
		description: 'List of categories or tags',
		example: ['Programming', 'TypeScript', 'Dependency Injection'],
		type: [String],
		required: false,
	})
	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	@IsOptional()
	categories: string[] = [];
}
