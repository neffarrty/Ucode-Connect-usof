import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(
		private readonly config: ConfigService,
		private readonly prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					return req.cookies?.['refresh_token'];
				},
			]),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('auth.jwt.refresh.secret'),
		});
	}

	async validate(payload: JwtPayload) {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.userId },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		return user;
	}
}
