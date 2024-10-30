import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly config: ConfigService,
		private readonly prisma: PrismaService,
	) {
		super({
			clientID: config.get<string>('auth.google.client.id'),
			clientSecret: config.get<string>('auth.google.client.secret'),
			callbackURL: config.get<string>('auth.google.callback.url'),
			scope: ['email', 'profile'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails, photos } = profile;
		const email = emails[0].value;
		let user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			user = await this.prisma.user.create({
				data: {
					login: email.split('@')[0],
					email,
					fullname: `${name.givenName} ${name.familyName}`,
					avatar: photos[0].value,
				},
			});
		}

		done(null, user);
	}
}
