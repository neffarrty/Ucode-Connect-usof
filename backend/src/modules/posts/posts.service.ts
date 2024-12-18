import {
	Injectable,
	ForbiddenException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
	PostDto,
	LikeDto,
	CreatePostDto,
	UpdatePostDto,
	CreateLikeDto,
	SortOptionsDto,
	FilterOptionsDto,
} from './dto';
import { CommentDto, CreateCommentDto } from 'src/modules/comments/dto';
import { CategoryDto } from 'src/modules/categories/dto/category.dto';
import { Paginated, PaginationOptionsDto } from 'src/pagination';
import { Category, LikeType, Prisma, Role, Status, User } from '@prisma/client';

@Injectable()
export class PostsService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(
		{ page, limit }: PaginationOptionsDto,
		{ sort, order }: SortOptionsDto,
		{ createdAt, categories, status, title }: FilterOptionsDto,
		user: User,
	): Promise<Paginated<PostDto>> {
		const where: Prisma.PostWhereInput = {
			AND: [
				{
					categories: {
						some: {
							category: {
								title: {
									in: categories,
								},
							},
						},
					},
				},
				{
					title: {
						contains: title,
						mode: 'insensitive',
					},
				},
				{ createdAt },
				{
					OR:
						user.role === Role.ADMIN
							? [
									{
										status,
									},
								]
							: [
									{
										status: Status.ACTIVE,
									},
									{
										authorId: user.id,
									},
								],
				},
			],
		};

		const [posts, count] = await this.prisma.$transaction([
			this.prisma.post.findMany({
				where,
				include: {
					categories: {
						select: {
							category: {
								select: {
									id: true,
									title: true,
									description: true,
								},
							},
						},
					},
					likes: {
						where: { authorId: user.id },
					},
					bookmarks: {
						where: { userId: user.id },
					},
					author: {
						select: {
							login: true,
							avatar: true,
							fullname: true,
						},
					},
				},
				orderBy: {
					[sort]: order,
				},
				take: limit,
				skip: (page - 1) * limit,
			}),
			this.prisma.post.count({ where }),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: posts.map(({ bookmarks, likes, ...post }) => ({
				...post,
				bookmarked: bookmarks.some((fav) => fav.userId === user.id),
				like: likes?.shift()?.type,
			})),
			meta: {
				page,
				total: count,
				count: limit,
				pages,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null,
			},
		};
	}

	async findById(id: number, user?: User): Promise<PostDto> {
		const post = await this.prisma.post.findUnique({
			where: {
				id,
			},
			include: user
				? {
						author: {
							select: {
								login: true,
								avatar: true,
								fullname: true,
							},
						},
						categories: {
							select: {
								category: {
									select: {
										id: true,
										title: true,
										description: true,
									},
								},
							},
						},
						bookmarks: { where: { userId: user.id } },
						likes: {
							where: { authorId: user.id },
						},
					}
				: undefined,
		});

		if (!post) {
			throw new NotFoundException(`Post with id ${id} not found`);
		}

		const { bookmarks, likes, ...result } = post;

		return {
			...result,
			bookmarked: user ? bookmarks.length > 0 : false,
			like: likes?.shift()?.type,
		};
	}

	async create(dto: CreatePostDto, user: User): Promise<PostDto> {
		const categories = await this.getCategoriesByTitles(dto.categories);

		return this.prisma.post.create({
			data: {
				authorId: user.id,
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
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
		});
	}

	async update(id: number, dto: UpdatePostDto, user: User): Promise<PostDto> {
		const post = await this.findById(id);

		if (post.authorId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Forbidden to update post');
		}

		const data: Prisma.PostUpdateInput = {
			...dto,
			categories: undefined,
		};

		if (dto.categories.length > 0) {
			const categories = await this.getCategoriesByTitles(dto.categories);

			data.categories = {
				deleteMany: {},
				create: categories.map((category) => ({
					category: {
						connect: {
							id: category.id,
						},
					},
				})),
			};
		}

		return this.prisma.post.update({
			where: {
				id,
			},
			data,
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
		});
	}

	async delete(id: number, user: User): Promise<PostDto> {
		const post = await this.findById(id);

		if (post.authorId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Forbidden to delete post');
		}

		return this.prisma.post.delete({
			where: {
				id,
			},
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
		});
	}

	async findComments(
		id: number,
		{ page, limit }: PaginationOptionsDto,
		user: User,
	): Promise<Paginated<CommentDto>> {
		await this.findById(id);

		const where: Prisma.CommentWhereInput = {
			postId: id,
		};
		const [comments, count] = await this.prisma.$transaction([
			this.prisma.comment.findMany({
				where,
				take: limit,
				skip: (page - 1) * limit,
				orderBy: {
					createdAt: 'desc',
				},
				include: {
					author: {
						select: {
							login: true,
							avatar: true,
							fullname: true,
						},
					},
					likes: {
						where: { authorId: user.id },
					},
				},
			}),
			this.prisma.comment.count({ where }),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: comments.map(({ likes, ...post }) => ({
				...post,
				like: likes?.shift()?.type,
			})),
			meta: {
				page,
				total: count,
				count: limit,
				pages,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null,
			},
		};
	}

	async addComment(
		id: number,
		dto: CreateCommentDto,
		user: User,
	): Promise<CommentDto> {
		const post = await this.findById(id);

		if (post.status === Status.INACTIVE) {
			throw new ForbiddenException('Post is inactive');
		}

		return this.prisma.comment.create({
			data: {
				postId: id,
				authorId: user.id,
				...dto,
			},
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
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

	async findLikes(id: number): Promise<LikeDto[]> {
		await this.findById(id);

		return this.prisma.like.findMany({
			where: {
				postId: id,
			},
		});
	}

	async addLike(
		id: number,
		{ type }: CreateLikeDto,
		user: User,
	): Promise<LikeDto> {
		const post = await this.findById(id);

		if (post.status === Status.INACTIVE) {
			throw new ForbiddenException('Post is inactive');
		}

		const like = await this.prisma.like.findFirst({
			where: {
				postId: id,
				authorId: user.id,
			},
		});

		if (like) {
			throw new ConflictException('User already liked this post');
		}

		const increment = type === LikeType.LIKE ? 1 : -1;
		const [result] = await this.prisma.$transaction([
			this.prisma.like.create({
				data: {
					postId: id,
					authorId: user.id,
					type,
				},
			}),
			this.prisma.post.update({
				where: {
					id,
				},
				data: {
					rating: {
						increment,
					},
					author: {
						update: {
							rating: {
								increment,
							},
						},
					},
				},
			}),
		]);

		return result;
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
			throw new NotFoundException('Like not found');
		}

		const increment = like.type === LikeType.LIKE ? -1 : 1;
		const [result] = await this.prisma.$transaction([
			this.prisma.like.delete({
				where: {
					id: like.id,
				},
			}),
			this.prisma.post.update({
				where: {
					id,
				},
				data: {
					rating: {
						increment,
					},
					author: {
						update: {
							rating: {
								increment,
							},
						},
					},
				},
			}),
		]);

		return result;
	}

	async addToBookmarks(id: number, user: User): Promise<PostDto> {
		const post = await this.findById(id);

		if (post.status === Status.INACTIVE) {
			throw new ForbiddenException('Post is inactive');
		}

		const bookmark = await this.prisma.bookmark.findFirst({
			where: {
				postId: id,
				userId: user.id,
			},
		});

		if (bookmark) {
			throw new ConflictException('Post already in bookmarks');
		}

		const result = await this.prisma.post.update({
			where: {
				id,
			},
			data: {
				bookmarks: {
					create: {
						userId: user.id,
					},
				},
			},
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
		});

		return {
			...result,
			bookmarked: true,
		};
	}

	async deleteFromBookmarks(id: number, user: User): Promise<PostDto> {
		await this.findById(id);

		const bookmark = await this.prisma.bookmark.findFirst({
			where: {
				postId: id,
				userId: user.id,
			},
		});

		if (!bookmark) {
			throw new NotFoundException("Post doesn't in bookmarks");
		}

		const post = await this.prisma.post.update({
			where: {
				id,
			},
			data: {
				bookmarks: {
					delete: {
						userId_postId: {
							userId: user.id,
							postId: id,
						},
					},
				},
			},
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
		});

		return {
			...post,
			bookmarked: false,
		};
	}

	private async getCategoriesByTitles(titles: string[]): Promise<Category[]> {
		return Promise.all(
			titles.map(async (title) => {
				const category = await this.prisma.category.findUnique({
					where: {
						title,
					},
				});

				if (!category) {
					throw new NotFoundException(
						`Category with title '${title}' doesn't exist'`,
					);
				}

				return category;
			}),
		);
	}
}
