import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleGuard } from './guards/google.guard';
import * as path from 'path';

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
			inject: [ConfigService],
			useFactory: async (
				config: ConfigService,
			): Promise<MailerOptions> => ({
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
					from: '"CodeTalk" <no-reply@usof.com>',
				},
				template: {
					dir: path.join(__dirname, '..', '..', 'templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),
		UsersModule,
		PassportModule,
	],
})
export class AuthModule {}
