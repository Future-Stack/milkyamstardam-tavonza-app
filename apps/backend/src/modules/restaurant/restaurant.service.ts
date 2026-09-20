import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { generateSlug } from '@/utils/slug-generator';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import { Restaurant } from '@prisma/client';
import {
  restaurantFilterFields,
  restaurantSearchFields,
  restaurantNestedFilters,
  restaurantRangeFilter,
  restaurantInclude,
} from './restaurant.constant';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async create(organizationId: string, data: CreateRestaurantDto, actorId: string, logo?: string) {
    const org = await this.prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new ApiError(HttpStatus.NOT_FOUND, 'Organization not found');

    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    const existingSlug = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (existingSlug) throw new ApiError(HttpStatus.CONFLICT, 'Restaurant slug already exists');

    const restaurant = await this.prisma.restaurant.create({
      data: {
        organizationId,
        name: data.name.trim(),
        slug,
        logoUrl: logo || data.logoUrl,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'RESTAURANT_CREATED',
      entityType: 'Restaurant',
      entityId: restaurant.id,
      metadata: { name: restaurant.name },
    });

    return restaurant;
  }

  async findAll(query: Record<string, any>): Promise<IGenericResponse<Restaurant[]>> {
    const formattedQuery = { ...query };
    if (formattedQuery.orgId && !formattedQuery.organizationId) {
      formattedQuery.organizationId = formattedQuery.orgId;
      delete formattedQuery.orgId;
    }

    const queryBuilder = new QueryBuilder<Restaurant>(formattedQuery, this.prisma.restaurant);
    const result = (await queryBuilder
      .filter(restaurantFilterFields as string[])
      .search(restaurantSearchFields as string[])
      .nestedFilter(restaurantNestedFilters)
      .sort()
      .paginate()
      .include(restaurantInclude)
      .fields()
      .filterByRange(restaurantRangeFilter)
      .execute()) as Restaurant[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { branches: true },
    });
    if (!restaurant) throw new ApiError(HttpStatus.NOT_FOUND, 'Restaurant not found');
    return restaurant;
  }

  async update(id: string, data: UpdateRestaurantDto, actorId: string) {
    const restaurant = await this.findOne(id);

    let slug = restaurant.slug;
    if (data.slug) {
      slug = generateSlug(data.slug);
      if (slug !== restaurant.slug) {
        const existingSlug = await this.prisma.restaurant.findUnique({ where: { slug } });
        if (existingSlug) throw new ApiError(HttpStatus.CONFLICT, 'Restaurant slug already exists');
      }
    }

    const updated = await this.prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.slug && { slug }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'RESTAURANT_UPDATED',
      entityType: 'Restaurant',
      entityId: restaurant.id,
      metadata: data,
    });

    return updated;
  }

  async remove(id: string, actorId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { branches: true },
        },
      },
    });

    if (!restaurant) throw new ApiError(HttpStatus.NOT_FOUND, 'Restaurant not found');

    if (restaurant._count.branches > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Cannot delete restaurant with active branches.');
    }

    await this.prisma.restaurant.delete({
      where: { id: restaurant.id },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'RESTAURANT_DELETED',
      entityType: 'Restaurant',
      entityId: restaurant.id,
    });

    return { message: 'Restaurant deleted successfully' };
  }
}
