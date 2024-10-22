import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

import config from './configs/config';
import auth from './configs/auth.config';
import mail from './configs/mail.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';

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
		PrismaModule,
		UsersModule,
		AuthModule,
	],
})
export class AppModule {}
