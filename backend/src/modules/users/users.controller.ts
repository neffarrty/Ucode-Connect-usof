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
} from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { UserDto, CreateUserDto, UpdateUserDto, FileUploadDto } from './dto';
import { PostDto } from 'src/modules/posts/dto';
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
	): Promise<Paginated<UserDto>> {
		return this.userService.findAll(paginationOptions);
	}

	@Get('bookmarks')
	@ApiOperation({ summary: 'Get all bookmarked posts for the current user' })
	@ApiPaginatedResponse(PostDto)
	async deletePostToBookmarks(
		@Query() paginationOptions: PaginationOptionsDto,
		@GetUser() user: User,
	) {
		return this.userService.findBookmarks(paginationOptions, user);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get specified user' })
	@ApiParam({
		name: 'id',
		description: 'id of the user',
	})
	@ApiOkResponse({ type: UserDto })
	@ApiNotFoundResponse({
		description: "User doesn't exist",
	})
	getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
		return this.userService.findById(id);
	}

	@Post()
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Create new user' })
	@ApiBody({ type: CreateUserDto })
	@ApiOkResponse({ type: UserDto })
	@ApiForbiddenResponse({
		description: 'Forbiden',
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
		description: "User doesn't exist",
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
				destination: './uploads/avatars',
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
		description: "User doesn't exist",
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
		description: "User doesn't exist",
	})
	deleteUser(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<UserDto> {
		return this.userService.delete(id, user);
	}
}
