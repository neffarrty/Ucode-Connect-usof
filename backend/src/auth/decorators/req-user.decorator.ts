import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		return context.switchToHttp().getRequest().user;
	},
);
