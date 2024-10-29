import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Category, Comment, Post, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@Injectable()
export class PostsService {
	constructor(readonly prisma: PrismaService) {}

	async findAll(): Promise<Post[]> {
		return this.prisma.post.findMany();
	}

	async findById(id: number): Promise<Post> {
		const post = await this.prisma.post.findUnique({ where: { id } });

		if (!post) {
			throw new NotFoundException(`Post with id ${id} doesn't exist`);
		}

		return post;
	}

	async create(userId: number, dto: CreatePostDto) {
		const categories = await this.getCategoriesByTitles(dto.categories);

		return this.prisma.post.create({
			data: {
				authorId: userId,
				...dto,
				categories: {
					create: categories.map((category) => ({
						category: {
							connect: {
								id: category.id,
							},
						},
					})),
				},
			},
		});
	}

	async update(id: number, user: User, dto: UpdatePostDto) {
		const post = await this.findById(id);

		if (post.authorId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException();
		}

		const categories = await this.getCategoriesByTitles(dto.categories);

		return this.prisma.post.update({
			where: {
				id,
			},
			data: {
				...dto,
				categories: {
					deleteMany: {},
					create: categories.map((category) => ({
						category: {
							connect: {
								id: category.id,
							},
						},
					})),
				},
			},
		});
	}

	async delete(id: number, user: User): Promise<Post> {
		const post = await this.findById(id);

		if (post.authorId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException();
		}

		return this.prisma.post.delete({
			where: {
				id,
			},
		});
	}

	async findComments(id: number): Promise<Comment[]> {
		await this.findById(id);

		return this.prisma.comment.findMany({
			where: {
				postId: id,
			},
		});
	}

	async addComment(
		id: number,
		user: User,
		dto: CreateCommentDto,
	): Promise<Comment> {
		const post = await this.findById(id);

		if (post.authorId !== user.id) {
			throw new ForbiddenException();
		}

		return this.prisma.comment.create({
			data: {
				postId: id,
				authorId: user.id,
				...dto,
			},
		});
	}

	async findCategories(id: number) {
		await this.findById(id);

		return this.prisma.post
			.findUnique({
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
			})
			.then((result) => ({
				categories: result.categories.map((c) => c.category),
			}));
	}

	async findLikes(id: number) {
		await this.findById(id);

		return this.prisma.post.findMany({
			where: {
				id,
			},
			include: {
				likes: true,
			},
		});
	}

	async addLike(id: number, user: User, dto: CreateLikeDto) {
		await this.findById(id);

		const like = await this.prisma.like.findFirst({
			where: {
				postId: id,
				authorId: user.id,
			},
		});

		if (like.authorId !== user.id) {
			throw new ForbiddenException();
		}

		if (like) {
			throw new ConflictException('Like already exists');
		}

		return this.prisma.like.create({
			data: {
				postId: id,
				authorId: user.id,
				...dto,
			},
		});
	}

	async deleteLike(id: number, user: User) {
		await this.findById(id);

		const like = await this.prisma.like.findFirst({
			where: {
				authorId: user.id,
				postId: id,
			},
		});

		if (!like) {
			throw new NotFoundException(`Like doesn't exist`);
		}

		if (like.authorId !== user.id) {
			throw new ForbiddenException();
		}

		return this.prisma.like.delete({
			where: {
				id: like.id,
			},
		});
	}

	private async getCategoriesByTitles(titles: string[]): Promise<Category[]> {
		return Promise.all(
			titles.map((title) => {
				const category = this.prisma.category.findUnique({
					where: {
						title,
					},
				});

				if (!category) {
					throw new NotFoundException(
						`Category with title '${title} doesn't exist'`,
					);
				}

				return category;
			}),
		);
	}
}
