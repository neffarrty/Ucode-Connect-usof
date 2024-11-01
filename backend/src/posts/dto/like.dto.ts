import { ApiProperty } from '@nestjs/swagger';
import { LikeType } from '@prisma/client';

export class LikeDto {
	@ApiProperty({
		description: 'Identifier of the like',
		example: 5440,
	})
	id: number;

	@ApiProperty({
		description: "Identifier of like's author",
		example: 12,
	})
	authorId: number;

	@ApiProperty({
		description:
			'Identifier of the comment; null if the like is not related to a comment',
		example: null,
	})
	commentId: number | null;

	@ApiProperty({
		description:
			'Identifier of the post; null if the like is not related to a post',
		example: 15584,
	})
	postId: number | null;

	@ApiProperty({
		description: 'Type of like',
		example: 'DISLIKE',
	})
	type: LikeType;

	@ApiProperty({
		description: 'Time when the like was created',
		example: '2024-10-27T10:53:57.740Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Time when the like was last updated',
		example: '2024-10-27T10:53:57.740Z',
	})
	updatedAt: Date;
}
