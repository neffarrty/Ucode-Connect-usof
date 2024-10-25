import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Comment, Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
	constructor(readonly prisma: PrismaService) {}

	async findAll(): Promise<Post[]> {
		return this.prisma.post.findMany();
	}

	async findById(id: number): Promise<Post | null> {
		return this.prisma.post.findUnique({
			where: {
				id,
			},
		});
	}

	async findComments(id: number): Promise<Comment[]> {
		return this.prisma.comment.findMany({
			where: {
				postId: id,
			},
		});
	}

	async addComment(
		postId: number,
		authorId: number,
		dto: any,
	): Promise<Comment> {
		return this.prisma.comment.create({
			data: {
				postId,
				authorId,
				...dto,
			},
		});
	}

	// TODO: remove nested 'category' object in 'categories' response
	async findCategories(id: number) {
		return this.prisma.post.findUnique({
			where: {
				id,
			},
			include: {
				categories: {
					select: {
						category: true,
					},
				},
			},
		});
	}

	async findLikes(id: number) {
		return this.prisma.post.findMany({
			where: {
				id,
			},
			include: {
				likes: true,
			},
		});
	}

	async create(userId: number, dto: CreatePostDto) {
		return this.prisma.post.create({
			data: {
				authorId: userId,
				...dto,
			},
		});
	}

	async update(id: number, dto: UpdatePostDto) {
		const post = await this.findById(id);

		if (!post) {
			throw new NotFoundException(`Post with id ${id} doesn't exist`);
		}

		return this.prisma.post.update({
			where: {
				id,
			},
			data: dto,
		});
	}

	async delete(id: number) {
		const post = await this.findById(id);

		if (!post) {
			throw new NotFoundException(`Post with id ${id} doesn't exist`);
		}

		return this.prisma.post.delete({
			where: {
				id,
			},
		});
	}

	async addLike(id: number, dto: any) {
		const post = await this.findById(id);

		if (!post) {
			throw new NotFoundException(`Post with id ${id} doesn't exist`);
		}

		return this.prisma.like.create({
			data: {
				postId: id,
				...dto,
			},
		});
	}

	async deleteLike(postId: number, authorId: number) {
		const like = await this.prisma.like.findFirst({
			where: {
				authorId,
				postId,
			},
		});

		if (!like) {
			throw new NotFoundException(`Like doesn't exist`);
		}

		return this.prisma.like.delete({
			where: {
				id: like.id,
			},
		});
	}
}
