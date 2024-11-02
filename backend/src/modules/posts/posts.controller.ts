import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Query,
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
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto';
import { PostDto } from './dto/post.dto';
import { LikeDto } from './dto/like.dto';
import { CommentDto } from 'src/modules/comments/dto/comment.dto';
import { CategoryDto } from 'src/modules/categories/dto/category.dto';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { ApiPaginatedResponse, Paginated } from 'src/pagination/paginated';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ApiAuth } from 'src/decorators/api-auth.decorator';

@ApiTags('posts')
@ApiAuth()
@ApiBadRequestResponse({
	description: 'Invalid data',
})
@Controller('posts')
export class PostsController {
	constructor(readonly postService: PostsService) {}

	@Get()
	@ApiOperation({ summary: 'Get all posts' })
	@ApiPaginatedResponse(PostDto)
	async getAllPosts(
		@Query() paginationOptions: PaginationOptionsDto,
		@GetUser() user: User,
	): Promise<Paginated<PostDto>> {
		return this.postService.findAll(paginationOptions, user);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiOkResponse({ type: PostDto })
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostDto> {
		return this.postService.findById(id);
	}

	@Post()
	@ApiOperation({ summary: 'Create new post' })
	@ApiBody({ type: CreatePostDto })
	@ApiOkResponse({ type: PostDto })
	async createPost(
		@Body() dto: CreatePostDto,
		@GetUser() user: User,
	): Promise<PostDto> {
		return this.postService.create(user.id, dto);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiBody({ type: UpdatePostDto })
	@ApiOkResponse({
		type: PostDto,
	})
	@ApiForbiddenResponse({
		description: 'Forbidden to update post',
	})
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async updatePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdatePostDto,
		@GetUser() user: User,
	): Promise<PostDto> {
		return this.postService.update(id, user, dto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiOkResponse({ type: PostDto })
	@ApiForbiddenResponse({
		description: 'Forbidden to delete post',
	})
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async deletePost(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<PostDto> {
		return this.postService.delete(id, user);
	}

	@Get(':id/comments')
	@ApiOperation({ summary: 'Get all comments under the specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiPaginatedResponse(PostDto)
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async getPostComments(
		@Param('id', ParseIntPipe) id: number,
		@Query() paginationOptions: PaginationOptionsDto,
	): Promise<Paginated<CommentDto>> {
		return this.postService.findComments(id, paginationOptions);
	}

	@Post(':id/comments')
	@ApiOperation({ summary: 'Add comment under the specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiOkResponse({ type: CommentDto })
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async createPostComment(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		@Body() dto: CreateCommentDto,
	): Promise<CommentDto> {
		return this.postService.addComment(id, user, dto);
	}

	@Get(':id/categories')
	@ApiOperation({ summary: 'Get categories related to the specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiOkResponse({ type: [CategoryDto] })
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async getPostCategories(
		@Param('id', ParseIntPipe) id: number,
	): Promise<CategoryDto[]> {
		return this.postService.findCategories(id);
	}

	@Get(':id/like')
	@ApiOperation({ summary: 'Get all likes under the specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiOkResponse({ type: [LikeDto] })
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async getPostLikes(
		@Param('id', ParseIntPipe) id: number,
	): Promise<LikeDto[]> {
		return this.postService.findLikes(id);
	}

	@Post(':id/like')
	@ApiOperation({ summary: 'Add like under the specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiBody({ type: CreateLikeDto })
	@ApiOkResponse({ type: LikeDto })
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	@ApiConflictResponse({
		description: 'Like already exists',
	})
	async addPostLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		@Body() dto: CreateLikeDto,
	): Promise<LikeDto> {
		return this.postService.addLike(id, user, dto);
	}

	@Delete(':id/like')
	@ApiOperation({ summary: 'Delete like under the specified post' })
	@ApiParam({
		name: 'id',
		description: 'id of the post',
	})
	@ApiOkResponse({ type: LikeDto })
	@ApiForbiddenResponse({
		description: 'Forbidden to delete like',
	})
	@ApiNotFoundResponse({
		description: "Post doesn't exist",
	})
	async deletePostLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<LikeDto> {
		return this.postService.deleteLike(id, user);
	}
}
