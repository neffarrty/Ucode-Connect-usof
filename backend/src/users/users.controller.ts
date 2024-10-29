import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	UseInterceptors,
	UploadedFile,
	BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { generateFilename, imageFileFilter } from 'src/helpers/files-helper';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get(':id')
	getUserById(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findById(id);
	}

	@Get()
	getAllUsers() {
		return this.userService.findAll();
	}

	@Roles([Role.ADMIN])
	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Patch(':id/avatar')
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
	updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
		@GetUser() user: User,
	) {
		return this.userService.update(id, user, updateUserDto);
	}

	@Delete(':id')
	deleteUser(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
		return this.userService.delete(id, user);
	}
}
