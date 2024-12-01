import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortType {
	POSTS = 'posts',
	TITLE = 'title',
	DATE = 'createdAt',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export class CategorySortingOptionsDto {
	@ApiProperty({
		type: SortType,
		default: SortType.POSTS,
		required: false,
		description: 'Field to sort by',
	})
	@IsEnum(SortType)
	@IsOptional()
	sort: SortType = SortType.POSTS;

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
