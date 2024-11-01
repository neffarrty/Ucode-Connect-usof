import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(
			PUBLIC_KEY,
			context.getHandler(),
		);

		return isPublic || super.canActivate(context);
	}
}
