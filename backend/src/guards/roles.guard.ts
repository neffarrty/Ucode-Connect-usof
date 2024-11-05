import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext) {
		const roles = this.reflector.get<Role[]>('roles', context.getHandler());
		const request = context.switchToHttp().getRequest();

		if (!roles) {
			return true;
		}

		return roles.includes(request.user.role);
	}
}
