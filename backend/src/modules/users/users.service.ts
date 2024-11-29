import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserDto, CreateUserDto, UpdateUserDto } from './dto';
import {
	FilteringOptionsDto,
	PostDto,
	SortingOptionsDto,
} from 'src/modules/posts/dto';
import { Paginated, PaginationOptionsDto } from 'src/pagination';
import { Prisma, Role, Status, User } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import * as bcrypt from 'bcryptjs';
import { CommentDto } from '../comments/dto';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
	) {}

	async findById(id: number): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
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

	async findAll({
		page,
		limit,
	}: PaginationOptionsDto): Promise<Paginated<UserDto>> {
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
				total: count,
				count: limit,
				pages,
				next: page < pages ? page + 1 : null,
				prev: page > 1 ? page - 1 : null,
			},
		};
	}

	async findBookmarks(
		{ page, limit }: PaginationOptionsDto,
		user: User,
	): Promise<Paginated<PostDto>> {
		const where = {
			bookmarks: {
				some: {
					userId: user.id,
				},
			},
		};

		const [posts, count] = await this.prisma.$transaction([
			this.prisma.post.findMany({
				where,
				include: {
					author: {
						select: {
							login: true,
							avatar: true,
						},
					},
				},
				take: limit,
				skip: (page - 1) * limit,
				orderBy: {
					createdAt: 'desc',
				},
			}),
			this.prisma.post.count({ where }),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: posts,
			meta: {
				page,
				total: count,
				count: limit,
				pages,
				next: page < pages ? page + 1 : null,
				prev: page > 1 ? page - 1 : null,
			},
		};
	}

	async findPosts(
		{ page, limit }: PaginationOptionsDto,
		{ sort, order }: SortingOptionsDto,
		{ createdAt, categories, status, title }: FilteringOptionsDto,
		user: User,
	): Promise<Paginated<PostDto>> {
		const where: Prisma.PostWhereInput = {
			AND: [
				{
					categories: {
						some: {
							category: {
								title: {
									in: categories,
								},
							},
						},
					},
				},
				{
					title: {
						contains: title,
						mode: 'insensitive',
					},
				},
				{ createdAt },
				{ status: user.role === Role.ADMIN ? status : Status.ACTIVE },
				{ authorId: user.id },
			],
		};

		const [posts, count] = await this.prisma.$transaction([
			this.prisma.post.findMany({
				where,
				include: {
					categories: {
						select: {
							category: {
								select: {
									id: true,
									title: true,
								},
							},
						},
					},
					bookmarks: {
						where: {
							userId: user.id,
						},
					},
					author: {
						select: {
							login: true,
							avatar: true,
						},
					},
				},
				orderBy: {
					[sort]: order,
				},
				take: limit,
				skip: (page - 1) * limit,
			}),
			this.prisma.post.count({ where }),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: posts.map(({ bookmarks, ...post }) => ({
				...post,
				bookmarked: bookmarks.some((fav) => fav.userId === user.id),
			})),
			meta: {
				page,
				total: count,
				count: limit,
				pages,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null,
			},
		};
	}

	async findComments(
		{ page, limit }: PaginationOptionsDto,
		{ sort, order }: SortingOptionsDto,
		{ createdAt }: FilteringOptionsDto,
		user: User,
	): Promise<Paginated<CommentDto>> {
		const where: Prisma.CommentWhereInput = {
			AND: [{ createdAt }, { authorId: user.id }],
		};

		const [comments, count] = await this.prisma.$transaction([
			this.prisma.comment.findMany({
				where,
				include: {
					author: {
						select: {
							login: true,
							avatar: true,
						},
					},
				},
				orderBy: {
					[sort]: order,
				},
				take: limit,
				skip: (page - 1) * limit,
			}),
			this.prisma.comment.count({ where }),
		]);
		const pages = Math.ceil(count / limit);

		return {
			data: comments,
			meta: {
				page,
				total: count,
				count: limit,
				pages,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null,
			},
		};
	}

	async create(dto: CreateUserDto): Promise<UserDto> {
		const { login, email } = dto;

		await this.checkIfNotExist(login, email);

		return this.prisma.user.create({
			data: {
				...dto,
				password: await bcrypt.hash(dto.password, 10),
				avatar: process.env.DEFAULT_AVATAR_URL,
			},
		});
	}

	async update(id: number, user: User, dto: UpdateUserDto): Promise<UserDto> {
		await this.findById(id);

		if (user.id !== id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Forbidden to update user');
		}

		await this.checkIfNotExist(dto.login, dto.email);

		if (dto.password) {
			dto.password = await bcrypt.hash(dto.password, 10);
		}

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
			throw new ForbiddenException('Forbidden to  delete user');
		}

		return this.prisma.user.delete({
			where: {
				id: id,
			},
		});
	}

	async setAvatar(user: User, file: Express.Multer.File): Promise<UserDto> {
		if (!file) {
			throw new BadRequestException('Invalid file');
		}

		const defaultUrl = this.config.get<string>('DEFAULT_AVATAR_URL');
		const appBaseUrl = this.config.get<string>('APP_BASE_URL');

		if (
			user.avatar !== defaultUrl &&
			this.isInternalUrl(user.avatar, appBaseUrl)
		) {
			try {
				await fs.unlink(`public/avatars/${path.basename(user.avatar)}`);
			} catch (err) {
				throw new InternalServerErrorException('Failed to delete file');
			}
		}

		return this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: `${appBaseUrl}/avatars/${file.filename}`,
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

	private isInternalUrl(url: string, baseUrl: string): boolean {
		try {
			return new URL(url).origin === new URL(baseUrl).origin;
		} catch {
			return false;
		}
	}
}
