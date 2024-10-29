import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
	constructor(readonly postService: PostsService) {}

	@Get()
	async getAllPosts() {
		return this.postService.findAll();
	}

	@Get(':id')
	async getPostById(@Param('id', ParseIntPipe) id: number) {
		return this.postService.findById(id);
	}

	@Post()
	async createPost(@Body() dto: CreatePostDto, @GetUser() user: User) {
		return this.postService.create(user.id, dto);
	}

	@Patch(':id')
	async updatePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdatePostDto,
		@GetUser() user: User,
	) {
		return this.postService.update(id, user, dto);
	}

	@Delete(':id')
	async deletePost(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	) {
		return this.postService.delete(id, user);
	}

	@Get(':id/comments')
	async getPostComments(@Param('id', ParseIntPipe) id: number) {
		return this.postService.findComments(id);
	}

	@Post(':id/comments')
	async createPostComment(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		@Body() dto: CreateCommentDto,
	) {
		return this.postService.addComment(id, user, dto);
	}

	@Get(':id/categories')
	async getPostCategories(@Param('id', ParseIntPipe) id: number) {
		return this.postService.findCategories(id);
	}

	@Get(':id/like')
	async getPostLikes(@Param('id', ParseIntPipe) id: number) {
		return this.postService.findLikes(id);
	}

	@Post(':id/like')
	async addPostLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		@Body() dto: CreateLikeDto,
	) {
		return this.postService.addLike(id, user, dto);
	}

	@Delete(':id/like')
	async deletePostLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	) {
		return this.postService.deleteLike(id, user);
	}
}
