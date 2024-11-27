import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetadata {
	@ApiProperty({
		description: 'The current page number',
		example: 4,
	})
	page: number;

	@ApiProperty({
		description: 'The total number of elements',
		example: 60,
	})
	total: number;

	@ApiProperty({
		description: 'The number of items per page',
		example: 15,
	})
	count: number;

	@ApiProperty({
		description: 'The total number of pages available',
		example: 4,
	})
	pages: number;

	@ApiProperty({
		description: 'The number of the next page number, or null',
		example: null,
	})
	next: number | null;

	@ApiProperty({
		description: 'The number of the previous page number, or null',
		example: 3,
	})
	prev: number | null;
}
