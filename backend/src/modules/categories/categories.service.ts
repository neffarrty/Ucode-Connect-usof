import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationOptionsDto, Paginated } from 'src/pagination';
import { PostDto } from 'src/modules/posts/dto/post.dto';
import { CategorySortOptionsDto, SortType } from './dto/sort-options.dto';
import { CategoryFilterOptionsDto } from './dto/filter-options.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(
		{ sort, order }: CategorySortOptionsDto,
		{ title }: CategoryFilterOptionsDto,
	): Promise<CategoryDto[]> {
		const where: Prisma.CategoryWhereInput = {
			title: {
				contains: title,
				mode: 'insensitive',
			},
		};

		const orderBy =
			sort === SortType.POSTS
				? { posts: { _count: order } }
				: { [sort]: order };

		const categories = await this.prisma.category.findMany({
			where,
			include: {
				_count: {
					select: { posts: true },
				},
			},
			orderBy,
		});

		return categories.map(({ _count, ...category }) => ({
			...category,
			posts: _count.posts,
		}));
	}

	// async findAll({
	// 	page,
	// 	limit,
	// }: PaginationOptionsDto): Promise<Paginated<CategoryDto>> {
	// 	const [categories, count] = await this.prisma.$transaction([
	// 		this.prisma.category.findMany({
	// 			take: limit,
	// 			skip: (page - 1) * limit,
	// 			include: {
	// 				_count: {
	// 					select: { posts: true },
	// 				},
	// 			},
	// 			orderBy: {
	// 				posts: {
	// 					_count: 'desc',
	// 				},
	// 			},
	// 		}),
	// 		this.prisma.category.count(),
	// 	]);
	// 	const pages = Math.ceil(count / limit);

	// 	return {
	// 		data: categories.map((category) => {
	// 			const { _count, ...data } = category;
	// 			return {
	// 				...data,
	// 				posts: _count.posts,
	// 			};
	// 		}),
	// 		meta: {
	// 			page,
	// 			total: count,
	// 			count: limit,
	// 			pages,
	// 			next: page < pages ? page + 1 : null,
	// 			prev: page > 1 ? page - 1 : null,
	// 		},
	// 	};
	// }

	async findById(id: number): Promise<CategoryDto> {
		const category = await this.prisma.category.findUnique({
			where: {
				id,
			},
			include: {
				_count: {
					select: { posts: true },
				},
			},
		});

		if (!category) {
			throw new NotFoundException(`Category with id ${id} not found`);
		}

		const { _count, ...data } = category;
		return {
			...data,
			posts: _count.posts,
		};
	}

	async findPosts(
		id: number,
		{ page, limit }: PaginationOptionsDto,
	): Promise<Paginated<PostDto>> {
		await this.findById(id);

		const where = {
			categories: {
				some: {
					categoryId: id,
				},
			},
		};
		const [posts, count] = await this.prisma.$transaction([
			this.prisma.post.findMany({
				where,
				include: {
					author: {
						select: {
							login: true,
							avatar: true,
						},
					},
				},
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
				total: count,
				count: limit,
				pages,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null,
			},
		};
	}

	async create(dto: CreateCategoryDto): Promise<CategoryDto> {
		await this.checkIfTitleExists(dto.title);

		return this.prisma.category.create({ data: dto });
	}

	async update(id: number, dto: UpdateCategoryDto): Promise<CategoryDto> {
		const category = await this.findById(id);

		if (dto.title && dto.title !== category.title) {
			await this.checkIfTitleExists(dto.title);
		}

		return this.prisma.category.update({
			where: {
				id,
			},
			data: dto,
		});
	}

	async delete(id: number): Promise<CategoryDto> {
		await this.findById(id);

		return this.prisma.category.delete({
			where: {
				id,
			},
		});
	}

	private async checkIfTitleExists(title: string) {
		const category = await this.prisma.category.findFirst({
			where: {
				title: {
					equals: title,
					mode: 'insensitive',
				},
			},
		});

		if (category) {
			throw new ConflictException(
				`Category with title ${title} already exists`,
			);
		}
	}
}
