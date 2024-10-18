import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role as RoleType } from '@prisma/client';
import { RoleGuard } from 'src/guards/role.guard';

export const Role = (role: RoleType) =>
	applyDecorators(SetMetadata('role', role), UseGuards(RoleGuard));
