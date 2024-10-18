import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext) {
		const role = this.reflector.get<Role>('role', context.getHandler());

		if (!role) {
			return true;
		}

		const request = context.switchToHttp().getRequest();

		return request.user.role === role;
	}
}
