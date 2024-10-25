import {
	Body,
	Controller,
	Get,
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
		return this.postService.findById(id);
	}

	@Get(':id/comments')
	async getPostComments(@Param('id', ParseIntPipe) id: number) {
		return this.postService.findComments(id);
	}

	@Post(':id/comments')
	async createPostComments(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: any,
	) {
		return this.postService.addComment(id, null);
	}

	@Get(':id/categories')
	async getPostCategories(@Param('id', ParseIntPipe) id: number) {
		return this.postService.findCategories(id);
	}

	@Get(':id/categories')
	async getPostLikes(@Param('id', ParseIntPipe) id: number) {
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
		return this.postService.update(id, dto);
	}
}
