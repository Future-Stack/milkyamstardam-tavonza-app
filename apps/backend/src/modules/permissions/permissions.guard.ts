import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionAction, GlobalRole } from '@prisma/client';
import { PrismaService } from '@/helper/prisma.service';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { IS_PUBLIC_KEY } from '../auth/auth.decorator';

/**
 * Branch-level authorization for `GlobalRole.STAFF` users.
 *
 * Platform roles (SUPER_ADMIN, ADMIN, RESTAURANT_OWNER) bypass the check — they
 * own the organization and are not scoped to one branch.
 *
 * Everyone else is a STAFF user, and STAFF covers every branch role from waiter
 * to regional manager. What separates them is `StaffAssignment.role` and, more
 * importantly, `StaffAssignment.permissions` — so this guard is the real gate on
 * every manager-facing route. A route with no `@Permissions` decorator is open
 * to any authenticated caller, which is why `@Roles` and `@Permissions` are
 * always added together.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

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

    // Platform-level roles bypass branch-level permission checks.
    if (
      user.role === GlobalRole.SUPER_ADMIN ||
      user.role === GlobalRole.ADMIN ||
      user.role === GlobalRole.RESTAURANT_OWNER
    ) {
      return true;
    }

    // The branch usually comes from the route. Some routes address a resource by
    // id instead (PATCH /menu-items/:id, PATCH /staff-assignments/:id) and carry
    // no branch, so those fall back to checking every active assignment.
    //
    // Known limitation: on those fallback routes the permission is granted if
    // the caller holds it at ANY of their branches, so it does not prove the
    // resource itself belongs to one of them. Closing that properly means
    // resolving the resource's branch in the service and passing it in.
    const branchId =
      request.params?.branchId || request.body?.branchId || request.query?.branchId;

    const assignments = await this.prisma.staffAssignment.findMany({
      where: {
        staff: { userId: user.id },
        isActive: true,
        ...(branchId ? { branchId } : {}),
      },
      select: { permissions: true },
    });

    if (assignments.length === 0) {
      throw new ForbiddenException(
        branchId
          ? 'You do not have an active assignment for this branch.'
          : 'You do not have an active branch assignment.',
      );
    }

    const hasPermission = requiredPermissions.every((permission) =>
      assignments.some((assignment) => assignment.permissions.includes(permission)),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Missing required branch permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
