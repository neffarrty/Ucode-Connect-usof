import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number) {
		return await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			omit: {
				password: true,
			},
		});
	}

	async findByLogin(login: string) {
		return await this.prisma.user.findUnique({
			where: {
				login: login,
			},
		});
	}

	async findByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	async findAll() {
		return await this.prisma.user.findMany({
			omit: {
				password: true,
			},
		});
	}

	async create(dto: CreateUserDto): Promise<User> {
		return this.prisma.user.create({
			data: dto,
		});
	}

	async update(id: number, dto: UpdateUserDto): Promise<User> {
		return this.prisma.user.update({
			where: {
				id: id,
			},
			data: dto,
		});
	}

	async remove(id: number): Promise<User> {
		return this.prisma.user.delete({
			where: {
				id: id,
			},
		});
	}
}
