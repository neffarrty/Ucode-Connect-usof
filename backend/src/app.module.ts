import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AdminModule } from './modules/admin/admin.module';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import appConfig from './configs/app.config';
import authConfig from './configs/auth.config';
import mailConfig from './configs/mail.config';
import redisConfig from './configs/redis.config';

@Module({
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtGuard,
		},
	],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig, authConfig, mailConfig, redisConfig],
		}),
		JwtModule.register({
			global: true,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'uploads', 'avatars'),
			serveRoot: '/avatars',
			serveStaticOptions: { index: false },
		}),
		RedisModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (
				config: ConfigService,
			): Promise<RedisModuleOptions> => ({
				config: {
					host: config.get<string>('redis.host'),
					port: config.get<number>('redis.post'),
					password: config.get<string>('redis.password'),
				},
			}),
		}),
		AdminModule.forRootAsync(),
		PrismaModule,
		AuthModule,
		UsersModule,
		PostsModule,
		CommentsModule,
		CategoriesModule,
	],
})
export class AppModule {}
