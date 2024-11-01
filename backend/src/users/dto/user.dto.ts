import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDto {
	@ApiProperty({
		description: 'Identifier of the user',
		example: 12,
	})
	id: number;

	@ApiProperty({
		description: 'Login of the user',
		example: 'john.smith',
	})
	login: string;

	@ApiProperty({
		description: 'Email address of the user',
		example: 'john.smith@example.com',
	})
	email: string;

	@ApiProperty({
		description: 'Full name of the user',
		example: 'John Smith',
	})
	fullname: string;

	@ApiProperty({
		description: 'Avatar URL of the user',
		example: 'https://example.com/avatar.jpg',
	})
	avatar: string;

	@ApiProperty({
		description: "User rating, reflecting the user's likes or dislikes",
		example: 128,
	})
	rating: number;

	@ApiProperty({
		description: 'Role of the user',
		example: 'USER',
	})
	role: Role;

	@ApiProperty({
		description: "Indicates if the user's email is verified or not",
		example: true,
	})
	verified: boolean;

	@ApiProperty({
		description: 'Time when the user was created',
		example: '2024-10-27T10:53:57.740Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Time when the user was last updated',
		example: '2024-10-27T10:53:57.740Z',
	})
	updatedAt: Date;
}
