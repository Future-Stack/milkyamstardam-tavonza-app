import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionAction, GlobalRole } from '@prisma/client';
import { PrismaService } from '@/helper/prisma.service';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { IS_PUBLIC_KEY } from '../auth/auth.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<PermissionAction[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Platform-level roles bypass branch-level permission checks
    if (
      user.role === GlobalRole.SUPER_ADMIN || 
      user.role === GlobalRole.ADMIN || 
      user.role === GlobalRole.RESTAURANT_OWNER
    ) {
      return true;
    }

    // Determine the branch ID. Usually from params, sometimes body or query.
    const branchId = request.params?.branchId || request.body?.branchId || request.query?.branchId;

    if (!branchId) {
      throw new ForbiddenException('Branch ID is required to evaluate permissions for this endpoint.');
    }

    // Fetch the staff assignment for this user and branch
    const staffAssignment = await this.prisma.staffAssignment.findFirst({
      where: {
        staff: {
          userId: user.id
        },
        branchId: branchId,
        isActive: true,
      },
      select: {
        permissions: true,
      }
    });

    if (!staffAssignment) {
      throw new ForbiddenException('You do not have an active assignment for this branch.');
    }

    // Waiter, Host, etc. must have every required permission specified in the route
    const hasPermission = requiredPermissions.every(permission => 
      staffAssignment.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException(`Missing required branch permissions: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }
}
