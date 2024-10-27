import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/update-category.dto';
import { UpdateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
	constructor(readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.category.findMany();
	}

	async findById(id: number): Promise<Category> {
		const category = this.prisma.category.findUnique({
			where: { id },
		});

		if (!category) {
			throw new NotFoundException(`Category with id ${id} doesn't exist`);
		}

		return category;
	}

	async findPosts(id: number) {
		await this.findById(id);

		return this.prisma.category.findUnique({
			where: { id },
			include: {
				posts: true,
			},
		});
	}

	async create(dto: CreateCategoryDto): Promise<Category> {
		return this.prisma.category.create({ data: dto });
	}

	// TODO: check if title exists in dto
	async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
		await this.findById(id);

		const category = this.prisma.category.findFirst({
			where: {
				title: {
					equals: dto.title,
					mode: 'insensitive',
				},
			},
		});

		if (category) {
			throw new ConflictException(
				`Category with title ${dto.title} already exists`,
			);
		}

		return this.prisma.category.update({
			where: { id },
			data: dto,
		});
	}

	async delete(id: number): Promise<Category> {
		await this.findById(id);

		return this.prisma.category.delete({
			where: { id },
		});
	}
}
