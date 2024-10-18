import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
	}

	async findByLogin(login: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				login: login,
			},
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	async findByVerifyToken(token: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				verifyToken: token,
			},
		});
	}

	async findAll(): Promise<User[] | null> {
		return await this.prisma.user.findMany();
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

	async delete(id: number): Promise<User> {
		return this.prisma.user.delete({
			where: {
				id: id,
			},
		});
	}

	async setAvatar(id: number, path: string): Promise<User> {
		return this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				avatar: path,
			},
		});
	}
}
