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
	ApiCreatedResponse,
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
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	@ApiOperation({ summary: 'Get all categories' })
	@ApiOkResponse({ type: [CategoryDto] })
	async getAllCategories(): Promise<CategoryDto[]> {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get specified category' })
	@ApiParam({
		name: 'id',
		description: 'id of the category',
	})
	@ApiOkResponse({ type: CategoryDto })
	@ApiNotFoundResponse({
		description: 'Category not found',
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
		description: 'Category not found',
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
	@ApiCreatedResponse({ type: CategoryDto })
	@ApiForbiddenResponse({
		description: 'User role must be ADMIN',
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
		description: 'User role must be ADMIN',
	})
	@ApiNotFoundResponse({
		description: 'Category not found',
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
		description: 'User role must be ADMIN',
	})
	@ApiNotFoundResponse({
		description: 'Category not found',
	})
	async deleteCategory(
		@Param('id', ParseIntPipe) id: number,
	): Promise<CategoryDto> {
		return this.categoriesService.delete(id);
	}
}
