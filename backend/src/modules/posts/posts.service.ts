import {
	Injectable,
	ForbiddenException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { Category, Post, Role, Status, User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { Paginated } from 'src/pagination/paginated';
import { PostDto } from './dto/post.dto';
import { LikeDto } from './dto/like.dto';
import { CommentDto } from 'src/modules/comments/dto/comment.dto';
import { CategoryDto } from 'src/modules/categories/dto/category.dto';

@Injectable()
export class PostsService {
	constructor(readonly prisma: PrismaService) {}

	async findAll(
		{ page, limit }: PaginationOptionsDto,
		user: User,
	): Promise<Paginated<PostDto>> {
		const where = {
			status: user.role === Role.USER ? Status.ACTIVE : undefined,
		};
		const [posts, count] = await this.prisma.$transaction([
			this.prisma.post.findMany({
				where,
				take: limit,
				skip: (page - 1) * limit,
			}),
			this.prisma.post.count({ where }),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: posts,
			meta: {
				page,
				count: limit,
				pages,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null,
			},
		};
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
			throw new ForbiddenException('Forbidden to update posts');
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
			throw new ForbiddenException('Forbidden to delete post');
		}

		return this.prisma.post.delete({
			where: {
				id,
			},
		});
	}

	async findComments(
		id: number,
		{ page, limit }: PaginationOptionsDto,
	): Promise<Paginated<CommentDto>> {
		await this.findById(id);

		const where = {
			postId: id,
		};
		const [comments, count] = await this.prisma.$transaction([
			this.prisma.comment.findMany({
				where,
				take: limit,
				skip: (page - 1) * limit,
			}),
			this.prisma.comment.count({ where }),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: comments,
			meta: {
				page,
				count: limit,
				pages,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null,
			},
		};
	}

	async addComment(
		id: number,
		user: User,
		dto: CreateCommentDto,
	): Promise<CommentDto> {
		await this.findById(id);

		return this.prisma.comment.create({
			data: {
				postId: id,
				authorId: user.id,
				...dto,
			},
		});
	}

	async findCategories(id: number): Promise<CategoryDto[]> {
		await this.findById(id);

		return this.prisma.category.findMany({
			where: {
				posts: {
					some: {
						postId: id,
					},
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
			},
		});
	}

	async findLikes(id: number) {
		await this.findById(id);

		return this.prisma.like.findMany({
			where: {
				postId: id,
			},
		});
	}

	async addLike(
		id: number,
		user: User,
		dto: CreateLikeDto,
	): Promise<LikeDto> {
		await this.findById(id);

		const like = await this.prisma.like.findFirst({
			where: {
				postId: id,
				authorId: user.id,
			},
		});

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

	async deleteLike(id: number, user: User): Promise<LikeDto> {
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
			throw new ForbiddenException('Forbidden to delete like');
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
