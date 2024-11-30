import {
	Injectable,
	ForbiddenException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CommentDto, UpdateCommentDto } from './dto';
import { LikeDto, CreateLikeDto } from 'src/modules/posts/dto';
import { LikeType, Role, User } from '@prisma/client';

@Injectable()
export class CommentsService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number): Promise<CommentDto> {
		const comment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
		});

		if (!comment) {
			throw new NotFoundException(`Comment with id ${id} not found`);
		}

		return comment;
	}

	async update(
		id: number,
		user: User,
		dto: UpdateCommentDto,
	): Promise<CommentDto> {
		const comment = await this.findById(id);

		if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Forbidden to update comment');
		}

		return this.prisma.comment.update({
			where: {
				id,
			},
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
			data: dto,
		});
	}

	async delete(id: number, user: User): Promise<CommentDto> {
		const comment = await this.findById(id);

		if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Forbidden to delete comment');
		}

		return this.prisma.comment.delete({
			where: {
				id,
			},
			include: {
				author: {
					select: {
						login: true,
						avatar: true,
						fullname: true,
					},
				},
			},
		});
	}

	async findLikes(id: number) {
		await this.findById(id);

		return this.prisma.comment.findUnique({
			where: {
				id,
			},
			include: {
				likes: true,
			},
		});
	}

	async addLike(
		id: number,
		user: User,
		{ type }: CreateLikeDto,
	): Promise<LikeDto> {
		await this.findById(id);

		const like = await this.prisma.like.findFirst({
			where: {
				commentId: id,
				authorId: user.id,
			},
		});

		if (like) {
			throw new ConflictException('User already liked this comment');
		}

		const increment = type === LikeType.LIKE ? 1 : -1;
		const [result] = await this.prisma.$transaction([
			this.prisma.like.create({
				data: {
					commentId: id,
					authorId: user.id,
					type,
				},
			}),
			this.prisma.comment.update({
				where: {
					id,
				},
				data: {
					rating: {
						increment,
					},
					author: {
						update: {
							rating: {
								increment,
							},
						},
					},
				},
			}),
		]);

		return result;
	}

	async deleteLike(id: number, user: User): Promise<LikeDto> {
		await this.findById(id);

		const like = await this.prisma.like.findFirst({
			where: {
				authorId: user.id,
				commentId: id,
			},
		});

		if (!like) {
			throw new NotFoundException('Like not found');
		}

		const increment = like.type === LikeType.LIKE ? -1 : 1;
		const [result] = await this.prisma.$transaction([
			this.prisma.like.delete({
				where: {
					id: like.id,
				},
			}),
			this.prisma.comment.update({
				where: {
					id,
				},
				data: {
					rating: {
						increment,
					},
					author: {
						update: {
							rating: {
								increment,
							},
						},
					},
				},
			}),
		]);

		return result;
	}
}
