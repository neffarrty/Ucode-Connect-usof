import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
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

	async findComments(id: number) {
		return this.prisma.comment.findMany({
			where: {
				postId: id,
			},
		});
	}

	async addComment(id: number, dto: any) {
		return this.prisma.comment.create({
			data: {
				postId: id,
				...dto,
			},
		});
	}

	async findCategories(id: number) {
		return this.prisma.post.findMany({
			where: {
				id,
			},
			select: {
				categories: true,
			},
		});
	}

	async findLikes(id: number) {
		return this.prisma.post.findMany({
			where: {
				id,
			},
			select: {
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
			throw new BadRequestException(`Post with id ${id} doesn't exist`);
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
			throw new BadRequestException(`Post with id ${id} doesn't exist`);
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
			throw new BadRequestException(`Post with id ${id} doesn't exist`);
		}

		return this.prisma.like.create({
			data: {
				postId: id,
				...dto,
			},
		});
	}

	async deleteLike(authorId: number, postId: number) {
		const like = await this.prisma.like.findUnique({
			where: {
				authorId_postId: { authorId, postId },
			},
		});

		if (!like) {
			throw new BadRequestException(
				`Post with id ${like.id} doesn't exist`,
			);
		}

		return this.prisma.like.delete({
			where: {
				id: like.id,
			},
		});
	}
}
