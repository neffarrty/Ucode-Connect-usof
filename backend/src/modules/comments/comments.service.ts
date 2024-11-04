import {
	Injectable,
	ForbiddenException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { Comment, Like, LikeType, Role, User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateLikeDto } from 'src/modules/posts/dto/create-like.dto';

@Injectable()
export class CommentsService {
	constructor(readonly prisma: PrismaService) {}

	async findById(id: number): Promise<Comment> {
		const comment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!comment) {
			throw new NotFoundException(`Comment with id ${id} doesn't exist`);
		}

		return comment;
	}

	async update(
		id: number,
		user: User,
		dto: UpdateCommentDto,
	): Promise<Comment> {
		const comment = await this.findById(id);

		if (comment.authorId !== user.id) {
			throw new ForbiddenException('Forbidden to update comment');
		}

		return this.prisma.comment.update({
			where: {
				id,
			},
			data: dto,
		});
	}

	async delete(id: number, user: User): Promise<Comment> {
		const comment = await this.findById(id);

		if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException('Forbidden to delete comment');
		}

		return this.prisma.comment.delete({
			where: {
				id,
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
	): Promise<Like> {
		await this.findById(id);

		const like = await this.prisma.like.findFirst({
			where: {
				commentId: id,
				authorId: user.id,
			},
		});

		if (like) {
			throw new ConflictException('Like already exists');
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

	async deleteLike(id: number, user: User): Promise<Like> {
		await this.findById(id);

		const like = await this.prisma.like.findFirst({
			where: {
				authorId: user.id,
				commentId: id,
			},
		});

		if (!like) {
			throw new NotFoundException(`Like doesn't exist`);
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
