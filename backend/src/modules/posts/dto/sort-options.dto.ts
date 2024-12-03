import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortType {
	RATING = 'rating',
	TITLE = 'title',
	DATE = 'createdAt',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export class SortOptionsDto {
	@ApiProperty({
		type: SortType,
		default: SortType.RATING,
		required: false,
		description: 'Field to sort by',
	})
	@IsEnum(SortType)
	@IsOptional()
	sort: SortType = SortType.RATING;

	@ApiProperty({
		type: SortOrder,
		default: SortOrder.DESC,
		required: false,
		description: 'Sort order',
	})
	@IsEnum(SortOrder)
	@IsOptional()
	order: SortOrder = SortOrder.DESC;
}
