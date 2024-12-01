import { ApiProperty } from '@nestjs/swagger';
import { LikeType } from '@prisma/client';
import { UserDto } from 'src/modules/users/dto';

export class CommentDto {
	@ApiProperty({
		description: 'Identifier of the comment',
		example: 1453,
	})
	id: number;

	@ApiProperty({
		description: "Identifier of comment's author",
		example: 12,
	})
	authorId: number;

	@ApiProperty({
		description: "Comment's author",
	})
	author: Partial<UserDto>;

	@ApiProperty({
		description: 'Identifier of the post under which comment is posted',
		example: 145,
	})
	postId: number;

	@ApiProperty({
		description: 'Content of the comment',
		example: 'Great article! Really helped me understand the topic better.',
	})
	content: string;

	@ApiProperty({
		description: 'Rating of the comments',
		example: 15,
	})
	rating: number;

	@ApiProperty({
		description: 'Information about rate of comment by the current user',
		example: LikeType.DISLIKE,
	})
	like?: LikeType;

	@ApiProperty({
		description: 'Time when the comment was created',
		example: '2024-10-27T10:53:57.740Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Time when the comment was last updated',
		example: '2024-10-27T10:53:57.740Z',
	})
	updatedAt: Date;
}
