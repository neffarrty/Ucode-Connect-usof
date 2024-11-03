import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsDate,
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class DateFilterDto {
	@ApiProperty({})
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	lte?: Date;

	@ApiProperty({})
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	gte?: Date;
}

export class FilteringOptionsDto {
	@ApiProperty({
		type: DateFilterDto,
	})
	@IsOptional()
	@Type(() => DateFilterDto)
	createdAt?: DateFilterDto;

	@ApiProperty({
		type: [String],
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	@IsDefined()
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	categories?: string[];

	@ApiProperty({
		type: Status,
	})
	@IsOptional()
	@IsEnum(Status)
	status?: Status;
}
