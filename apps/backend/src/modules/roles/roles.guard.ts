import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { GlobalRole } from '@prisma/client';
import { IS_PUBLIC_KEY } from '../auth/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<GlobalRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // The JWT payload signs the role as `role` (see AuthService.login).
    const role: GlobalRole | undefined = user?.role;

    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException(
        `Access denied. This endpoint requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }
 
    return true;
  }
}
