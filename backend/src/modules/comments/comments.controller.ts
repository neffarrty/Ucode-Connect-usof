import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	ParseIntPipe,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiParam,
	ApiBody,
	ApiOkResponse,
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CommentDto, UpdateCommentDto } from './dto';
import { LikeDto, CreateLikeDto } from 'src/modules/posts/dto';
import { GetUser, ApiAuth } from 'src/decorators';
import { User } from '@prisma/client';

@ApiTags('comments')
@ApiAuth()
@ApiBadRequestResponse({
	description: 'Invalid data',
})
@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get specified comment by id' })
	@ApiParam({
		name: 'id',
		description: 'id of the comment',
	})
	@ApiOkResponse({ type: CommentDto })
	@ApiNotFoundResponse({
		description: "Comment doesn't exist",
	})
	async getCommentById(
		@Param('id', ParseIntPipe) id: number,
	): Promise<CommentDto> {
		return this.commentsService.findById(id);
	}

	@Get(':id/like')
	@ApiOperation({ summary: 'Get all likes under the specified comment' })
	@ApiParam({
		name: 'id',
		description: 'id of the comment',
	})
	@ApiOkResponse({ type: [LikeDto] })
	@ApiNotFoundResponse({
		description: "Comment doesn't exist",
	})
	async getCommentLikes(@Param('id', ParseIntPipe) id: number) {
		return this.commentsService.findLikes(id);
	}

	@Post(':id/like')
	@ApiOperation({ summary: 'Add like under the specified comment' })
	@ApiParam({
		name: 'id',
		description: 'id of the comment',
	})
	@ApiBody({ type: CreateLikeDto })
	@ApiCreatedResponse({ type: LikeDto })
	@ApiNotFoundResponse({
		description: "Comment doesn't exist",
	})
	@ApiConflictResponse({
		description: 'Like already exists',
	})
	async addCommentLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		@Body() dto: CreateLikeDto,
	): Promise<LikeDto> {
		return this.commentsService.addLike(id, user, dto);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update specified comment' })
	@ApiParam({
		name: 'id',
		description: 'id of the comment',
	})
	@ApiBody({ type: UpdateCommentDto })
	@ApiOkResponse({
		type: CommentDto,
	})
	@ApiForbiddenResponse({
		description: 'Forbidden to update comment',
	})
	@ApiNotFoundResponse({
		description: "Comment doesn't exist",
	})
	async updateComment(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		@Body() dto: UpdateCommentDto,
	): Promise<CommentDto> {
		return this.commentsService.update(id, user, dto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete specified comment' })
	@ApiParam({
		name: 'id',
		description: 'id of the comment',
	})
	@ApiOkResponse({ type: CommentDto })
	@ApiForbiddenResponse({
		description: 'Forbidden to delete comment',
	})
	@ApiNotFoundResponse({
		description: "Comment doesn't exist",
	})
	async deleteComment(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<CommentDto> {
		return this.commentsService.delete(id, user);
	}

	@Delete(':id/like')
	@ApiOperation({ summary: 'Delete like under the specified comment' })
	@ApiParam({
		name: 'id',
		description: 'id of the comment',
	})
	@ApiOkResponse({ type: LikeDto })
	@ApiNotFoundResponse({
		description: "Comment doesn't exist",
	})
	async deleteCommentLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<LikeDto> {
		return this.commentsService.deleteLike(id, user);
	}
}
