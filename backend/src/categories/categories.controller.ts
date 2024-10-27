import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/update-category.dto';
import { UpdateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(readonly categoriesService: CategoriesService) {}

	@Get()
	async getAllCategories() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	async getCategoryById(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.findById(id);
	}

	@Get(':id/posts')
	async getPostsByCategoryId(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.findPosts(id);
	}

	@Roles([Role.ADMIN])
	@Post()
	async createCategory(dto: CreateCategoryDto) {
		return this.categoriesService.create(dto);
	}

	@Roles([Role.ADMIN])
	@Patch(':id')
	async updateCategory(
		@Param('id', ParseIntPipe) id: number,
		dto: UpdateCategoryDto,
	) {
		return this.categoriesService.update(id, dto);
	}

	@Roles([Role.ADMIN])
	@Delete(':id')
	async deleteCategory(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.delete(id);
	}
}
