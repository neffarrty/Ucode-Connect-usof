import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Module({
	providers: [AuthService],
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
	],
})
export class AuthModule {}
