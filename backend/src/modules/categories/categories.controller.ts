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
	ApiBearerAuth,
	ApiBody,
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { ApiPaginatedResponse, Paginated } from 'src/pagination/paginated';
import { CategoryDto } from './dto/category.dto';
import { PostDto } from 'src/modules/posts/dto/post.dto';
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto';

@ApiTags('categories')
@ApiBearerAuth()
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
