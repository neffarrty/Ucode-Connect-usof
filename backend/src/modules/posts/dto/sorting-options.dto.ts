import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortType {
	LIKES = 'likes',
	DATE = 'createdAt',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export class SortingOptionsDto {
	@ApiProperty({
		type: SortType,
		default: SortType.LIKES,
		required: false,
	})
	@IsEnum(SortType)
	@IsOptional()
	sort: SortType = SortType.LIKES;

	@ApiProperty({
		type: SortOrder,
		default: SortOrder.DESC,
		required: false,
	})
	@IsEnum(SortOrder)
	@IsOptional()
	order: SortOrder = SortOrder.DESC;
}
