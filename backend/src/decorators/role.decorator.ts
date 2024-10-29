import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/guards/roles.guard';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) =>
	applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
