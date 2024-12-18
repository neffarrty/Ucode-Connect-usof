import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/modules/prisma/prisma.service';

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
		profile: Profile,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails, photos } = profile;
		const email = emails[0].value;
		const fullname = `${name.givenName} ${name.familyName || ''}`.trim();
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
					fullname,
					avatar: photos[0].value,
					verified: true,
				},
			});
		}

		done(null, user);
	}
}
