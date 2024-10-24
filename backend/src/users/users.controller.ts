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
	ForbiddenException,
	BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { generateFilename, imageFileFilter } from 'src/helpers/files-helper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get(':id')
	findUserById(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findById(id);
	}

	@Get()
	findAllUsers() {
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
		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot set user avatar');
		}

		if (!file) {
			throw new BadRequestException('Invalid file');
		}

		return this.userService.setAvatar(id, file.originalname);
	}

	@Patch(':id')
	updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
		@GetUser() user: User,
	) {
		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot update user');
		}
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	deleteUser(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot delete user');
		}
		return this.userService.delete(id);
	}
}
