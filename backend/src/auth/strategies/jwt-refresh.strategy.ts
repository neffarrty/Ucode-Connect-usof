import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req.cookies?.['refresh_token'],
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('auth.jwt.refresh.secret'),
		});
	}

	async validate(req: Request, payload: any) {
		return {
			payload,
		};
	}
}
