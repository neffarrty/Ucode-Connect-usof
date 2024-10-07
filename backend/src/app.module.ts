import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: '30m',
			},
		}),
		PrismaModule,
		UsersModule,
		AuthModule,
	],
})
export class AppModule {}
