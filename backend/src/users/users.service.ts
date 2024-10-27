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

	async findAll(): Promise<User[] | null> {
		return await this.prisma.user.findMany();
	}

	async create(dto: CreateUserDto): Promise<User> {
		const { login, email } = dto;

		await this.checkIfNotExist(login, email);

		return this.prisma.user.create({
			data: dto,
		});
	}

	async update(id: number, user: User, dto: UpdateUserDto): Promise<User> {
		await this.findById(id);

		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot set user avatar');
		}

		await this.checkIfNotExist(dto.login, dto.email);

		return this.prisma.user.update({
			where: {
				id: id,
			},
			data: dto,
		});
	}

	async delete(id: number, user: User): Promise<User> {
		await this.findById(id);

		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Cannot set user avatar');
		}

		return this.prisma.user.delete({
			where: {
				id: id,
			},
		});
	}

	async setAvatar(id: number, user: User, path: string): Promise<User> {
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
