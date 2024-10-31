import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { Paginated } from 'src/pagination/paginated';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		if (!user) {
			throw new NotFoundException(`User with id ${id} doesn't exist`);
		}

		return user;
	}

	async findByLogin(login: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				login: login,
			},
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	async findByVerifyToken(token: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				verifyToken: token,
			},
		});
	}

	async findAll({
		page,
		limit,
	}: PaginationOptionsDto): Promise<Paginated<User>> {
		const [users, count] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				take: limit,
				skip: (page - 1) * limit,
			}),
			this.prisma.user.count(),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: users,
			meta: {
				page,
				count: limit,
				pages,
				next: page < pages ? page + 1 : null,
				prev: page > 1 ? page - 1 : null,
			},
		};
	}

	async create(dto: CreateUserDto): Promise<UserDto> {
		const { login, email } = dto;

		await this.checkIfNotExist(login, email);

		return this.prisma.user.create({
			data: dto,
		});
	}

	async update(id: number, user: User, dto: UpdateUserDto): Promise<UserDto> {
		await this.findById(id);

		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot update user');
		}

		await this.checkIfNotExist(dto.login, dto.email);

		return this.prisma.user.update({
			where: {
				id: id,
			},
			data: dto,
		});
	}

	async delete(id: number, user: User): Promise<UserDto> {
		await this.findById(id);

		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot delete user');
		}

		return this.prisma.user.delete({
			where: {
				id: id,
			},
		});
	}

	async setAvatar(id: number, user: User, path: string): Promise<UserDto> {
		await this.findById(id);

		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot set user avatar');
		}

		return this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				avatar: path,
			},
		});
	}

	private async checkIfNotExist(login: string, email: string): Promise<void> {
		if (login) {
			const userByLogin = await this.findByLogin(login);
			if (userByLogin) {
				throw new ConflictException(
					`User with login ${login} already exists`,
				);
			}
		}

		if (email) {
			const userByEmail = await this.findByEmail(email);
			if (userByEmail) {
				throw new ConflictException(
					`User with email ${email} already exists`,
				);
			}
		}
	}
}
