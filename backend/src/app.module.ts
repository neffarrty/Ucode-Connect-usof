import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostsModule } from './posts/posts.module';

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
			rootPath: join(__dirname, '..', '..', 'uploads', 'avatar'),
			serveRoot: '/avatar',
			serveStaticOptions: { index: false },
		}),
		PrismaModule,
		UsersModule,
		AuthModule,
		PostsModule,
	],
})
export class AppModule {}
