import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
	constructor(
		private readonly config: ConfigService,
		private readonly prisma: PrismaService,
	) {
		super({
			clientID: config.get<string>('auth.github.client.id'),
			clientSecret: config.get<string>('auth.github.client.secret'),
			callbackURL: config.get<string>('auth.github.callback.url'),
			scope: ['user:email'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: any,
	): Promise<any> {
		const { username, emails, photos } = profile;
		const email = emails[0].value;
		const photo = photos[0].value;
		let user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			user = await this.prisma.user.create({
				data: {
					login: username,
					email: email,
					avatar: photo,
					verified: true,
				},
			});
		}

		done(null, user);
	}
}
