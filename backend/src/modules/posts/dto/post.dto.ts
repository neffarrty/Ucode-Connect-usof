import { ApiProperty } from '@nestjs/swagger';
import { LikeType, Status } from '@prisma/client';
import { UserDto } from 'src/modules/users/dto';

export class PostDto {
	@ApiProperty({
		description: 'Identifier of the post',
		example: 145,
	})
	id: number;

	@ApiProperty({
		description: "Identifier of post's author",
		example: 12,
	})
	authorId: number;

	@ApiProperty({
		description: 'Author of the post',
	})
	author: Partial<UserDto>;

	@ApiProperty({
		description: 'Information about rate of post by the current user',
		example: LikeType.DISLIKE,
	})
	like?: LikeType;

	@ApiProperty({
		description: 'Title of the post',
		example: 'Understanding Dependency Injection in TypeScript',
	})
	title: string;

	@ApiProperty({
		description: 'Status of the post',
		example: 'ACTIVE',
	})
	status: Status;

	@ApiProperty({
		description: 'Main content of the post',
		example: 'Dependency Injection is a powerful design pattern that...',
	})
	content: string;

	@ApiProperty({
		description: 'Rating of the post',
		example: 45,
	})
	rating: number;

	@ApiProperty({
		description: 'Whether the post in bookmarks of the current user',
		example: true,
	})
	bookmarked?: boolean;

	@ApiProperty({
		description: 'Time when the post was created',
		example: '2024-10-27T10:53:57.740Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Time when the post was last updated',
		example: '2024-10-27T10:53:57.740Z',
	})
	updatedAt: Date;
}
