import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import {
	PAGINATION_DEFAULT_LIMIT,
	PAGINATION_DEFAULT_PAGE,
} from './pagination-constants';

export class PaginationOptionsDto {
	@ApiProperty({
		default: PAGINATION_DEFAULT_PAGE,
		required: false,
	})
	@IsNumber()
	@Type(() => Number)
	@IsPositive()
	@IsOptional()
	page: number = PAGINATION_DEFAULT_PAGE;

	@ApiProperty({
		default: PAGINATION_DEFAULT_LIMIT,
		required: false,
	})
	@IsNumber()
	@Type(() => Number)
	@IsPositive()
	@IsOptional()
	limit: number = PAGINATION_DEFAULT_LIMIT;
}
