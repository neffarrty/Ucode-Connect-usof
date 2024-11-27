import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					return req.cookies?.['refresh_token'];
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('auth.jwt.refresh.secret'),
		});
	}

	async validate(payload: JwtPayload) {
		const user = this.usersService.findById(payload.userId);

		if (!user) {
			throw new BadRequestException('Invalid token');
		}

		return user;
	}
}
