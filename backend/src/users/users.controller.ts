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
	BadRequestException,
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
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { generateFilename, imageFileFilter } from 'src/helpers/files-helper';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { ApiPaginatedResponse, Paginated } from 'src/pagination/paginated';

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

	@Patch(':id/avatar')
	@ApiOperation({ summary: 'Set profile image for specified user' })
	@ApiConsumes('multipart/form-data')
	@ApiParam({
		name: 'id',
		description: 'id of the user',
	})
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
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads/avatar',
				filename: generateFilename,
			}),
			fileFilter: imageFileFilter,
		}),
	)
	setUserAvatar(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile() file: Express.Multer.File,
		@GetUser() user: User,
	) {
		if (!file) {
			throw new BadRequestException('Invalid file');
		}

		return this.userService.setAvatar(id, user, file.originalname);
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
