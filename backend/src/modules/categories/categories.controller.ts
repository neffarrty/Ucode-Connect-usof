import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	ParseIntPipe,
	Query,
	Body,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiParam,
	ApiBody,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiConflictResponse,
} from '@nestjs/swagger';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PostDto } from 'src/modules/posts/dto';
import { CreateCommentDto } from 'src/modules/comments/dto';
import {
	ApiPaginatedResponse,
	Paginated,
	PaginationOptionsDto,
} from 'src/pagination';
import { ApiAuth, Roles } from 'src/decorators';
import { Role } from '@prisma/client';

@ApiTags('categories')
@ApiAuth()
@Controller('categories')
export class CategoriesController {
	constructor(readonly categoriesService: CategoriesService) {}

	@Get()
	@ApiOperation({ summary: 'Get all categories' })
	@ApiPaginatedResponse(CategoryDto)
	async getAllCategories(
		@Query() paginationOptions: PaginationOptionsDto,
	): Promise<Paginated<CategoryDto>> {
		return this.categoriesService.findAll(paginationOptions);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get specified category' })
	@ApiParam({
		name: 'id',
		description: 'id of the category',
	})
	@ApiOkResponse({ type: CategoryDto })
	@ApiNotFoundResponse({
		description: "Category doesn't exist",
	})
	async getCategoryById(
		@Param('id', ParseIntPipe) id: number,
	): Promise<CategoryDto> {
		return this.categoriesService.findById(id);
	}

	@Get(':id/posts')
	@ApiOperation({ summary: 'Get all posts with the specified category' })
	@ApiParam({
		name: 'id',
		description: 'id of the category',
	})
	@ApiPaginatedResponse(PostDto)
	@ApiNotFoundResponse({
		description: "Category doesn't exist",
	})
	async getPostsByCategoryId(
		@Param('id', ParseIntPipe) id: number,
		@Query() paginationOptions: PaginationOptionsDto,
	): Promise<Paginated<PostDto>> {
		return this.categoriesService.findPosts(id, paginationOptions);
	}

	@Post()
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Create new category' })
	@ApiBody({ type: CreateCommentDto })
	@ApiOkResponse({ type: CategoryDto })
	@ApiForbiddenResponse({
		description: 'Forbidden to create category',
	})
	@ApiConflictResponse({
		description: 'Title is already taken',
	})
	async createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
		return this.categoriesService.create(dto);
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Update specified category' })
	@ApiParam({
		name: 'id',
		description: 'id of the category',
	})
	@ApiBody({ type: UpdateCategoryDto })
	@ApiOkResponse({ type: CategoryDto })
	@ApiForbiddenResponse({
		description: 'Forbidden to update category',
	})
	@ApiNotFoundResponse({
		description: "Category doesn't exist",
	})
	@ApiConflictResponse({
		description: 'Title is already taken',
	})
	async updateCategory(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateCategoryDto,
	): Promise<CategoryDto> {
		return this.categoriesService.update(id, dto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Delete specified category' })
	@ApiParam({
		name: 'id',
		description: 'id of the category',
	})
	@ApiOkResponse({ type: CategoryDto })
	@ApiForbiddenResponse({
		description: 'Forbidden to delete category',
	})
	@ApiNotFoundResponse({
		description: "Category doesn't exist",
	})
	async deleteCategory(
		@Param('id', ParseIntPipe) id: number,
	): Promise<CategoryDto> {
		return this.categoriesService.delete(id);
	}
}
