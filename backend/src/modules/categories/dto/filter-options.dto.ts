import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryFilterOptionsDto {
	@ApiProperty({
		type: String,
		required: false,
		description: 'Filter by title',
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	title?: string;
}
