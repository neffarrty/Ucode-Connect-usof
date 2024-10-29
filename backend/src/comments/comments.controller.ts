import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Comment, Like, User } from '@prisma/client';
import { CreateLikeDto } from 'src/posts/dto/create-like.dto';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
	constructor(readonly commentsService: CommentsService) {}

	@Get(':id')
	async getCommentById(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Comment> {
		return this.commentsService.findById(id);
	}

	@Get(':id/like')
	async getCommentLikes(@Param('id', ParseIntPipe) id: number) {
		return this.commentsService.findLikes(id);
	}

	@Post(':id/like')
	async addCommentCommentLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		dto: CreateLikeDto,
	): Promise<Like> {
		return this.commentsService.addLike(id, user, dto);
	}

	@Patch(':id')
	async updateComment(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		dto: UpdateCommentDto,
	): Promise<Comment> {
		return this.commentsService.update(id, user, dto);
	}

	@Delete(':id')
	async deleteComment(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<Comment> {
		return this.commentsService.delete(id, user);
	}

	@Delete(':id/like')
	async deleteCommentLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<Like> {
		return this.commentsService.deleteLike(id, user);
	}
}
