import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserFilterOptionsDto {
	@ApiProperty({
		type: String,
		required: false,
		description: 'Filter by login of user',
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	login?: string;
}
