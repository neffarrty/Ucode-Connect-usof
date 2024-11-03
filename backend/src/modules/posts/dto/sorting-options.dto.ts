import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortType {
	RATING = 'rating',
	DATE = 'createdAt',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export class SortingOptionsDto {
	@ApiProperty({
		type: SortType,
		default: SortType.RATING,
		required: false,
	})
	@IsEnum(SortType)
	@IsOptional()
	sort: SortType = SortType.RATING;

	@ApiProperty({
		type: SortOrder,
		default: SortOrder.DESC,
		required: false,
	})
	@IsEnum(SortOrder)
	@IsOptional()
	order: SortOrder = SortOrder.DESC;
}
