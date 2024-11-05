import { RedisService } from '@liaoliaots/nestjs-redis';
import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_KEY } from 'src/decorators';
import Redis from 'ioredis';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	private readonly redis: Redis | null;

	constructor(
		private readonly reflector: Reflector,
		private readonly redisService: RedisService,
	) {
		super();
		this.redis = this.redisService.getOrThrow();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>(
			PUBLIC_KEY,
			context.getHandler(),
		);

		if (isPublic) {
			return true;
		}

		const activate = await super.canActivate(context);
		if (!activate) {
			return false;
		}

		const request = context.switchToHttp().getRequest();
		const token = request.headers['authorization']?.split(' ')[1];
		const isBlacklisted = await this.redis.get(token);
		if (isBlacklisted) {
			throw new UnauthorizedException('Token is revoked');
		}

		return true;
	}
}
