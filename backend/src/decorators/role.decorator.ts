import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/guards/role.guard';

export const Roles = (...roles: Role[]) =>
	applyDecorators(SetMetadata('roles', roles), UseGuards(RoleGuard));
