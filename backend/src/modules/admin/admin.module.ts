import { DynamicModule, Module } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import * as bcrypt from 'bcrypt';

@Module({})
export class AdminModule {
	static async forRootAsync(): Promise<DynamicModule> {
		const { AdminModule } = await import('@adminjs/nestjs');
		const { Database, Resource, getModelByName } = await import(
			'@adminjs/prisma'
		);
		const AdminJS = await import('adminjs');
		AdminJS.default.registerAdapter({ Database, Resource });

		const prisma = new PrismaClient();

		return AdminModule.createAdminAsync({
			imports: [PrismaModule],
			inject: [PrismaService],
			useFactory: (prisma: PrismaService) => ({
				adminJsOptions: {
					rootPath: '/admin',
					resources: [
						{
							resource: {
								model: getModelByName('User'),
								client: prisma,
							},
							options: {
								listProperties: [
									'id',
									'login',
									'email',
									'fullname',
									'role',
									'rating',
									'verified',
								],
								showProperties: [
									'id',
									'login',
									'email',
									'fullname',
									'avatar',
									'role',
									'rating',
									'verified',
									'createdAt',
									'updatedAt',
								],
								editProperties: [
									'login',
									'email',
									'fullname',
									'password',
									'role',
									'verified',
								],
								filterProperties: [
									'login',
									'email',
									'fullname',
									'role',
									'verified',
									'rating',
									'createdAt',
								],
								actions: {
									new: {
										before: async (request) => {
											if (request.payload.password) {
												const hashedPassword =
													await bcrypt.hash(
														request.payload
															.password,
														10,
													);

												request.payload = {
													...request.payload,
													password: hashedPassword,
												};
											}
											return request;
										},
									},
								},
							},
						},
						{
							resource: {
								model: getModelByName('Post'),
								client: prisma,
							},
							options: {
								listProperties: [
									'id',
									'title',
									'author',
									'status',
									'createdAt',
								],
								showProperties: [
									'id',
									'author',
									'title',
									'content',
									'status',
									'createdAt',
									'updatedAt',
								],
								editProperties: ['author', 'title', 'content'],
								filterProperties: [
									'title',
									'author',
									'status',
									'createdAt',
									'updatedAt',
								],
							},
						},
						{
							resource: {
								model: getModelByName('Comment'),
								client: prisma,
							},
							options: {
								listProperties: [
									'id',
									'author',
									'content',
									'post',
									'createdAt',
								],
								showProperties: [
									'id',
									'author',
									'content',
									'post',
									'createdAt',
									'updatedAt',
								],
								editProperties: ['author', 'content', 'post'],
								filterProperties: [
									'author',
									'post',
									'createdAt',
								],
							},
						},
						{
							resource: {
								model: getModelByName('Like'),
								client: prisma,
							},
							options: {
								listProperties: [
									'id',
									'author',
									'post',
									'comment',
									'type',
									'createdAt',
								],
								showProperties: [
									'id',
									'author',
									'post',
									'comment',
									'type',
									'createdAt',
									'updatedAt',
								],
								editProperties: [
									'author',
									'post',
									'comment',
									'type',
								],
								filterProperties: [
									'author',
									'type',
									'createdAt',
								],
							},
						},
						{
							resource: {
								model: getModelByName('Category'),
								client: prisma,
							},
							options: {
								listProperties: [
									'id',
									'title',
									'description',
									'createdAt',
								],
								showProperties: [
									'id',
									'title',
									'description',
									'createdAt',
									'updatedAt',
								],
								editProperties: ['title', 'description'],
								filterProperties: ['title', 'createdAt'],
							},
						},
					],
				},
				auth: {
					authenticate: async (email: string, password: string) => {
						const admin = await prisma.user.findUnique({
							where: {
								email,
								role: Role.ADMIN,
							},
						});

						if (!admin) {
							return null;
						}

						const match = await bcrypt.compare(
							password,
							admin.password,
						);

						if (!match) return null;

						return { id: `${admin.id}`, email: admin.email };
					},
					cookieName: 'adminjs',
					cookiePassword: 'secret',
				},
				sessionOptions: {
					resave: true,
					saveUninitialized: true,
					secret: 'secret',
				},
			}),
		});
	}
}
