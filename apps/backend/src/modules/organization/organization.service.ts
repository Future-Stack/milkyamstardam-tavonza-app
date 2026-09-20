import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GlobalRole, Organization } from '@prisma/client';
import { PrismaService } from '@/helper/prisma.service';
import { IGenericResponse } from '@/interface/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiError } from '@/utils/api_error';
import { generateSlug } from '@/utils/slug-generator';
import QueryBuilder from '@/utils/query_builder';
import { AuditLogService } from '../audit-log/audit-log.service';
import {
  organizationFilterFields,
  organizationNestedFilters,
  organizationRangeFilter,
  organizationSearchFields,
} from './organization.constant';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  private async resolveActor(actor?: { id: string; role?: GlobalRole } | string): Promise<{ id: string; role?: GlobalRole } | null> {
    if (!actor) return null;
    const actorId = typeof actor === 'string' ? actor : actor.id;
    let actorRole = typeof actor === 'string' ? undefined : actor.role;

    if (!actorRole && actorId) {
      const dbActor = await this.prisma.user.findUnique({
        where: { id: actorId },
        select: { role: true },
      });
      actorRole = dbActor?.role;
    }

    return { id: actorId, role: actorRole };
  }

  async create(data: CreateOrganizationDto, actor: { id: string; role?: GlobalRole } | string) {
    const actorInfo = await this.resolveActor(actor);
    const actorId = actorInfo?.id;
    const actorRole = actorInfo?.role;

    let ownerId: string;
    if (actorRole === GlobalRole.SUPER_ADMIN) {
      if (!data.ownerId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'ownerId is required when creating an organization as SUPER_ADMIN');
      }
      const owner = await this.prisma.user.findUnique({
        where: { id: data.ownerId },
        select: { id: true },
      });
      if (!owner) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Owner user not found');
      }
      ownerId = data.ownerId;
    } else {
      // Created by ADMIN for himself
      ownerId = actorId;
    }

    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    const existingSlug = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ApiError(HttpStatus.CONFLICT, 'Organization slug already exists');
    }

    const org = await this.prisma.organization.create({
      data: {
        name: data.name.trim(),
        ownerId,
        slug,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'ORGANIZATION_CREATED',
      entityType: 'Organization',
      entityId: org.id,
      metadata: { name: org.name, slug: org.slug, ownerId },
    });

    return org;
  }

  async findAll(
    queryOrActor: Record<string, any> | { id: string; role?: GlobalRole } | string = {},
    actorParam?: { id: string; role?: GlobalRole } | string,
  ): Promise<IGenericResponse<Organization[]>> {
    let query: Record<string, any> = {};
    let actor: { id: string; role?: GlobalRole } | string | undefined = actorParam;

    if (actorParam !== undefined) {
      query = (queryOrActor as Record<string, any>) || {};
      actor = actorParam;
    } else if (
      typeof queryOrActor === 'string' ||
      (queryOrActor &&
        typeof queryOrActor === 'object' &&
        ('role' in queryOrActor || 'id' in queryOrActor) &&
        !('page' in queryOrActor || 'limit' in queryOrActor || 'searchTerm' in queryOrActor))
    ) {
      query = {};
      actor = queryOrActor as { id: string; role?: GlobalRole } | string;
    } else {
      query = (queryOrActor as Record<string, any>) || {};
    }

    const actorInfo = await this.resolveActor(actor);

    const queryBuilder = new QueryBuilder<Organization>(query, this.prisma.organization);

    queryBuilder
      .filter(organizationFilterFields as string[])
      .search(organizationSearchFields as string[])
      .nestedFilter(organizationNestedFilters)
      .sort()
      .paginate()
      .fields()
      .filterByRange(organizationRangeFilter);

    if (actorInfo?.role !== GlobalRole.SUPER_ADMIN && actorInfo?.id) {
      queryBuilder.rawFilter({ ownerId: actorInfo.id });
    }

    const data = (await queryBuilder.execute()) as Organization[];
    const meta = await queryBuilder.countTotal();

    return { meta, data };
  }

  async findOne(id: string, actor?: { id: string; role?: GlobalRole } | string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let org = isObjectId
      ? await this.prisma.organization.findUnique({
          where: { id },
        })
      : null;

    if (!org) {
      org = await this.prisma.organization.findUnique({
        where: { slug: id },
      });
    }

    if (!org) throw new ApiError(HttpStatus.NOT_FOUND, 'Organization not found');

    if (actor) {
      const actorInfo = await this.resolveActor(actor);
      if (actorInfo?.role !== GlobalRole.SUPER_ADMIN && org.ownerId !== actorInfo?.id) {
        throw new ApiError(HttpStatus.FORBIDDEN, 'You do not have permission to access this organization');
      }
    }

    return org;
  }

  async findBySlug(slug: string, actor?: { id: string; role?: GlobalRole } | string) {
    return this.findOne(slug, actor);
  }

  async update(id: string, data: UpdateOrganizationDto, actor: { id: string; role?: GlobalRole } | string) {
    const actorInfo = await this.resolveActor(actor);
    const org = await this.findOne(id, actor);

    if (data.ownerId && data.ownerId !== org.ownerId) {
      if (actorInfo?.role !== GlobalRole.SUPER_ADMIN) {
        throw new ApiError(HttpStatus.FORBIDDEN, 'Only a SUPER_ADMIN can transfer organization ownership');
      }
      const newOwner = await this.prisma.user.findUnique({
        where: { id: data.ownerId },
        select: { id: true },
      });
      if (!newOwner) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'New owner user not found');
      }
    }

    if (data.slug && data.slug !== org.slug) {
      const slug = generateSlug(data.slug);
      const existingSlug = await this.prisma.organization.findUnique({ where: { slug } });
      if (existingSlug) throw new ApiError(HttpStatus.CONFLICT, 'Organization slug already exists');
      data.slug = slug;
    }

    const updated = await this.prisma.organization.update({
      where: { id: org.id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.slug && { slug: data.slug }),
        ...(actorInfo?.role === GlobalRole.SUPER_ADMIN && data.ownerId && { ownerId: data.ownerId }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId: actorInfo?.id || '',
      action: 'ORGANIZATION_UPDATED',
      entityType: 'Organization',
      entityId: org.id,
      metadata: data,
    });

    return updated;
  }

  async remove(id: string, actor: { id: string; role?: GlobalRole } | string) {
    const actorInfo = await this.resolveActor(actor);
    const org = await this.findOne(id, actor);

    const orgWithCount = await this.prisma.organization.findUnique({
      where: { id: org.id },
      include: {
        _count: {
          select: { restaurants: true },
        },
      },
    });

    if (orgWithCount && orgWithCount._count.restaurants > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Cannot delete organization with active restaurants.');
    }

    await this.prisma.organization.delete({
      where: { id: org.id },
    });

    this.auditLog.handleAuditLogEvent({
      actorId: actorInfo?.id || '',
      action: 'ORGANIZATION_DELETED',
      entityType: 'Organization',
      entityId: org.id,
    });

    return { message: 'Organization deleted successfully' };
  }
}
