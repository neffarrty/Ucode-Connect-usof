import { ApiProperty } from '@nestjs/swagger';
import { LikeType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateLikeDto {
	@ApiProperty()
	@IsEnum(LikeType)
	type: LikeType;
}
