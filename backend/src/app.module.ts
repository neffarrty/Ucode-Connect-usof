import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

import config from './config/config';
import auth from './config/auth.config';
import mail from './config/mail.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config, auth, mail],
		}),
		JwtModule.registerAsync({
			useFactory: async (config: ConfigService) => ({
				secret: config.get<string>('auth.jwt.secret'),
				signOptions: {
					expiresIn: config.get<string | number>(
						'auth.jwt.expiration',
					),
				},
			}),
			inject: [ConfigService],
			global: true,
		}),
		PrismaModule,
		UsersModule,
		AuthModule,
	],
})
export class AppModule {}
