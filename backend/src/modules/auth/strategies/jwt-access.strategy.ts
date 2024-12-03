import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly config: ConfigService,
		private readonly prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('auth.jwt.access.secret'),
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.userId },
		});

		if (!user) {
			throw new UnauthorizedException();
		}

		if (!user.verified) {
			throw new UnauthorizedException('User not verified');
		}

		return user;
	}
}
