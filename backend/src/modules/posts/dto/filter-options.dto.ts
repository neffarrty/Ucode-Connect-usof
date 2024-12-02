import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class DateFilterDto {
	@ApiProperty({
		required: false,
		description: 'Max date of post creating (inclusive)',
	})
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	lte?: Date;

	@ApiProperty({
		required: false,
		description: 'Min date of post creating (inclusive)',
	})
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	gte?: Date;
}

export class FilterOptionsDto {
	@ApiProperty({
		type: DateFilterDto,
		required: false,
		description: 'Filter by creation date using lte and gte',
	})
	@IsOptional()
	@Type(() => DateFilterDto)
	createdAt?: DateFilterDto;

	@ApiProperty({
		type: String,
		required: false,
		description: 'Array of category titles to filter by',
	})
	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	@IsOptional()
	categories?: string[];

	@ApiProperty({
		type: Status,
		required: false,
		description: 'Filter by status (ACTIVE or INACTIVE)',
	})
	@IsOptional()
	@IsEnum(Status)
	status?: Status;

	@ApiProperty({
		type: String,
		required: false,
		description: 'Filter by title',
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	title?: string;
}
