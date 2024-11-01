import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
	@ApiProperty({
		description: 'Content of the comment provided by the user',
		example: 'Great article! Really helped me understand the topic better.',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	content: string;
}
