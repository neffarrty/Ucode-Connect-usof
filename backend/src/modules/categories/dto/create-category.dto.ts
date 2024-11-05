import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
	@ApiProperty({
		description: 'The title of category',
		example: 'JavaScript',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'The description of category',
		example: 'JavaScript tutorials and resources',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	description: string;
}
