import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import * as path from 'path';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		JwtRefreshStrategy,
		LocalAuthGuard,
		JwtAuthGuard,
		JwtRefreshAuthGuard,
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
		PassportModule,
	],
})
export class AuthModule {}
