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
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { NotFoundError } from 'rxjs';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
	constructor(readonly postService: PostsService) {}

	@Get()
	async getAllPosts() {
		return this.postService.findAll();
	}

	@Get(':id')
	async getPostById(@Param('id', ParseIntPipe) id: number) {
		await this.checkPostExistence(id);

		return this.postService.findById(id);
	}

	@Get(':id/comments')
	async getPostComments(@Param('id', ParseIntPipe) id: number) {
		await this.checkPostExistence(id);

		return this.postService.findComments(id);
	}

	@Post(':id/comments')
	async createPostComments(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: any,
		@GetUser() user: User,
	) {
		await this.checkPostExistence(id);

		return this.postService.addComment(id, user.id, dto);
	}

	@Get(':id/categories')
	async getPostCategories(@Param('id', ParseIntPipe) id: number) {
		await this.checkPostExistence(id);

		return this.postService.findCategories(id);
	}

	@Get(':id/like')
	async getPostLikes(@Param('id', ParseIntPipe) id: number) {
		await this.checkPostExistence(id);

		return this.postService.findLikes(id);
	}

	@Post()
	async createPost(@Body() dto: CreatePostDto, @GetUser() user: User) {
		return this.postService.create(user.id, dto);
	}

	@Patch(':id')
	async updatePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdatePostDto,
	) {
		await this.checkPostExistence(id);

		return this.postService.update(id, dto);
	}

	@Delete(':id')
	async deletePost(@Param('id', ParseIntPipe) id: number) {
		await this.checkPostExistence(id);

		return this.postService.delete(id);
	}

	@Delete(':id/like')
	async deletePostLike(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	) {
		await this.checkPostExistence(id);

		return this.postService.deleteLike(id, user.id);
	}

	async checkPostExistence(id: number) {
		const post = await this.postService.findById(id);

		if (!post) {
			throw new NotFoundException(`Post with id ${id} doesn't exist`);
		}
	}
}
