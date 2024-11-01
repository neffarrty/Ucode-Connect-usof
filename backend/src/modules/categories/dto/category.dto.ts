import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
	@ApiProperty({
		description: 'Identifier for the category',
		example: 102,
	})
	id: number;

	@ApiProperty({
		description: 'Title of the category',
		example: 'TypeScript',
	})
	title: string;

	@ApiProperty({
		description: 'Description of the category',
		example:
			'A programming language that builds on JavaScript by adding static type definitions',
	})
	description: string;
}
