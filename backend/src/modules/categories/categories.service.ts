import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { Paginated } from 'src/pagination/paginated';
import { CategoryDto } from './dto/category.dto';
import { PostDto } from 'src/modules/posts/dto/post.dto';

@Injectable()
export class CategoriesService {
	constructor(readonly prisma: PrismaService) {}

	async findAll({
		page,
		limit,
	}: PaginationOptionsDto): Promise<Paginated<CategoryDto>> {
		const [categories, count] = await this.prisma.$transaction([
			this.prisma.category.findMany({
				take: limit,
				skip: (page - 1) * limit,
			}),
			this.prisma.category.count(),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: categories,
			meta: {
				page,
				count: limit,
				pages,
				next: page < pages ? page + 1 : null,
				prev: page > 1 ? page - 1 : null,
			},
		};
	}

	async findById(id: number): Promise<CategoryDto> {
		const category = this.prisma.category.findUnique({
			where: {
				id,
			},
		});

		if (!category) {
			throw new NotFoundException(`Category with id ${id} doesn't exist`);
		}

		return category;
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

	async create(dto: CreateCategoryDto): Promise<CategoryDto> {
		await this.checkIfTitleExists(dto.title);

		return this.prisma.category.create({ data: dto });
	}

	async update(id: number, dto: UpdateCategoryDto): Promise<CategoryDto> {
		await this.findById(id);

		if (dto.title) {
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
		const category = this.prisma.category.findFirst({
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
