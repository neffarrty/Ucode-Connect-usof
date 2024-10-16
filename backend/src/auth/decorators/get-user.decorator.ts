import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
	(data: unknown, context: ExecutionContext): User => {
		return context.switchToHttp().getRequest().user;
	},
);
