import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
	@ApiProperty({
		description: 'Content of the comment provided by the user',
		type: String,
		example: 'Great article! Really helped me understand the topic better.',
	})
	@IsString()
	@IsNotEmpty()
	content: string;
}
