import { ApiProperty } from '@nestjs/swagger';
import { LikeType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateLikeDto {
	@ApiProperty({
		description: 'Type of like provided by user',
		example: 'LIKE',
		type: String,
		enum: LikeType,
	})
	@IsEnum(LikeType)
	type: LikeType;
}
