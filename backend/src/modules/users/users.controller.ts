import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Query,
	Param,
	ParseIntPipe,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import {
	ApiTags,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiBody,
	ApiOkResponse,
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiConflictResponse,
	ApiUnprocessableEntityResponse,
	ApiInternalServerErrorResponse,
	ApiCreatedResponse,
} from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { UserDto, CreateUserDto, UpdateUserDto, FileUploadDto } from './dto';
import {
	FilterOptionsDto,
	PostDto,
	SortOptionsDto,
} from 'src/modules/posts/dto';
import { diskStorage } from 'multer';
import { GetUser, Roles, ApiAuth } from 'src/decorators';
import { generateFilename, imageFileFilter } from 'src/helpers/files-helper';
import {
	ApiPaginatedResponse,
	Paginated,
	PaginationOptionsDto,
} from 'src/pagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role, User } from '@prisma/client';
import { CommentDto } from '../comments/dto';
import { UserFilterOptionsDto } from './dto/filter-options.dto';

@ApiTags('users')
@ApiAuth()
@ApiBadRequestResponse({
	description: 'Invalid data',
})
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	@ApiPaginatedResponse(UserDto)
	getAllUsers(
		@Query() paginationOptions: PaginationOptionsDto,
		@Query() filterOptions: UserFilterOptionsDto,
	): Promise<Paginated<UserDto>> {
		return this.userService.findAll(paginationOptions, filterOptions);
	}

	@Get('bookmarks')
	@ApiOperation({ summary: 'Get all bookmarked posts for the current user' })
	@ApiPaginatedResponse(PostDto)
	async getUserBookmarks(
		@Query() paginationOptions: PaginationOptionsDto,
		@GetUser() user: User,
	) {
		return this.userService.findBookmarks(paginationOptions, user);
	}

	@Get(':id/posts')
	@ApiOperation({ summary: 'Get posts of specified user' })
	@ApiParam({
		name: 'id',
		description: 'id of the user',
	})
	@ApiPaginatedResponse(PostDto)
	@ApiNotFoundResponse({
		description: 'User not found',
	})
	async getUserPosts(
		@Param('id', ParseIntPipe) id: number,
		@Query() paginationOptions: PaginationOptionsDto,
		@Query() sortingOptions: SortOptionsDto,
		@Query() filteringOptions: FilterOptionsDto,
		@GetUser() user: User,
	): Promise<Paginated<PostDto>> {
		return this.userService.findPosts(
			id,
			paginationOptions,
			sortingOptions,
			filteringOptions,
			user,
		);
	}

	@Get(':id/comments')
	@ApiOperation({ summary: 'Get comments of specified user' })
	@ApiParam({
		name: 'id',
		description: 'id of the user',
	})
	@ApiPaginatedResponse(CommentDto)
	@ApiNotFoundResponse({
		description: 'User not found',
	})
	async getUserComment(
		@Param('id', ParseIntPipe) id: number,
		@Query() paginationOptions: PaginationOptionsDto,
		@Query() sortingOptions: SortOptionsDto,
		@Query() filteringOptions: FilterOptionsDto,
	): Promise<Paginated<CommentDto>> {
		return this.userService.findComments(
			id,
			paginationOptions,
			sortingOptions,
			filteringOptions,
		);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get specified user' })
	@ApiParam({
		name: 'id',
		description: 'id of the user',
	})
	@ApiOkResponse({ type: UserDto })
	@ApiNotFoundResponse({
		description: 'User not found',
	})
	getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
		return this.userService.findById(id);
	}

	@Post()
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Create new user' })
	@ApiBody({ type: CreateUserDto })
	@ApiCreatedResponse({ type: UserDto })
	@ApiForbiddenResponse({
		description: 'User role must be ADMIN',
	})
	@ApiConflictResponse({
		description: 'Email or username is already taken',
	})
	createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
		return this.userService.create(createUserDto);
	}

	@Patch('avatar')
	@ApiOperation({ summary: 'Set profile image for specified user' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'A new avatar for the user',
		type: FileUploadDto,
	})
	@ApiOkResponse({ type: UserDto })
	@ApiForbiddenResponse({
		description: 'Forbiden',
	})
	@ApiNotFoundResponse({
		description: 'User not found',
	})
	@ApiUnprocessableEntityResponse({
		description: 'Invalid file type',
	})
	@ApiInternalServerErrorResponse({
		description: 'Failed to delete file',
	})
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './public/avatars',
				filename: generateFilename,
			}),
			fileFilter: imageFileFilter,
		}),
	)
	setUserAvatar(
		@UploadedFile() file: Express.Multer.File,
		@GetUser() user: User,
	) {
		return this.userService.setAvatar(user, file);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update specified user' })
	@ApiParam({
		name: 'id',
		description: 'id of the user',
	})
	@ApiBody({ type: UpdateUserDto })
	@ApiOkResponse({ type: UserDto })
	@ApiForbiddenResponse({
		description: 'Forbiden',
	})
	@ApiNotFoundResponse({
		description: 'User not found',
	})
	@ApiConflictResponse({
		description: 'Email or username is already taken',
	})
	updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
		@GetUser() user: User,
	): Promise<UserDto> {
		return this.userService.update(id, user, updateUserDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete specified user' })
	@ApiParam({
		name: 'id',
		description: 'id of the user',
	})
	@ApiOkResponse({ type: UserDto })
	@ApiForbiddenResponse({
		description: 'Forbiden',
	})
	@ApiNotFoundResponse({
		description: 'User not found',
	})
	deleteUser(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<UserDto> {
		return this.userService.delete(id, user);
	}
}
