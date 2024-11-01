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

import config from './configs/config';
import auth from './configs/auth.config';
import mail from './configs/mail.config';

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
			load: [config, auth, mail],
		}),
		JwtModule.register({
			global: true,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'uploads', 'avatars'),
			serveRoot: '/avatars',
			serveStaticOptions: { index: false },
		}),
		PrismaModule,
		AuthModule,
		UsersModule,
		PostsModule,
		CommentsModule,
		CategoriesModule,
		AdminModule.forRootAsync(),
	],
})
export class AppModule {}
