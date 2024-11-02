import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
	ArrayMinSize,
	ArrayNotEmpty,
	IsArray,
	IsDate,
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class DateFilterDto {
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	lte?: Date;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	gte?: Date;
}

export class FilteringOptionsDto {
	@IsOptional()
	@Type(() => DateFilterDto)
	createdAt?: DateFilterDto;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@IsDefined()
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	categories?: string[];

	@IsOptional()
	@IsEnum(Status)
	status?: Status;
}
