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
	ParseFilePipeBuilder,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFilename } from 'src/helpers/generate-filename';

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

	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Patch(':id/avatar')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './public/avatars',
				filename: (req, file, callback) => {
					callback(null, generateFilename(file));
				},
			}),
		}),
	)
	setUserAvatar(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1048576 }),
					new FileTypeValidator({ fileType: '(png|jpeg|jpg)' }),
				],
				errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			}),
		)
		image: Express.Multer.File,
	) {
		return this.userService.setAvatar(id, image.path);
	}

	@Patch(':id')
	updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	deleteUser(@Param('id', ParseIntPipe) id: number) {
		return this.userService.delete(id);
	}
}
