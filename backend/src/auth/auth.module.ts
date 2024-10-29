import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PassportModule } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import * as path from 'path';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleGuard } from './guards/google.guard';

@Module({
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		JwtRefreshStrategy,
		GoogleStrategy,
		LocalGuard,
		JwtGuard,
		JwtRefreshGuard,
		GoogleGuard,
	],
	controllers: [AuthController],
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				transport: {
					service: 'gmail',
					host: config.get<string>('mail.host'),
					port: config.get<number>('mail.port'),
					secure: true,
					auth: {
						user: config.get<string>('mail.user'),
						pass: config.get<string>('mail.pass'),
					},
				},
				defaults: {
					from: '"BugTalk" <no-reply@usof.com>',
				},
				template: {
					dir: path.join(__dirname, '..', 'templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		PrismaModule,
		PassportModule,
	],
})
export class AuthModule {}
