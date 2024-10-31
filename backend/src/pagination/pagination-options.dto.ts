import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationOptionsDto {
	@ApiProperty({
		default: 1,
		required: false,
	})
	@IsNumber()
	@Type(() => Number)
	@IsPositive()
	@IsOptional()
	page: number = 1;

	@ApiProperty({
		default: 15,
		required: false,
	})
	@IsNumber()
	@Type(() => Number)
	@IsPositive()
	@IsOptional()
	limit: number = 15;
}
