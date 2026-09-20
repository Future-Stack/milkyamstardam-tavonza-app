import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateMenuCategoryDto, UpdateMenuCategoryDto } from './dto/menu-category.dto';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { CreateModifierGroupDto, UpdateModifierGroupDto, CreateModifierDto, UpdateModifierDto } from './dto/modifier.dto';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import { MenuCategory, MenuItem } from '@prisma/client';
import {
  menuCategoryFilterFields,
  menuCategorySearchFields,
  menuCategoryNestedFilters,
  menuCategoryRangeFilter,
  menuCategoryInclude,
  menuItemFilterFields,
  menuItemSearchFields,
  menuItemNestedFilters,
  menuItemRangeFilter,
  menuItemInclude,
} from './menu.constant';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  // --- MENU CATEGORY ---

  async createCategory(data: CreateMenuCategoryDto, actorId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: data.restaurantId } });
    if (!restaurant) throw new ApiError(HttpStatus.NOT_FOUND, 'Restaurant not found');

    const category = await this.prisma.menuCategory.create({
      data: {
        restaurantId: data.restaurantId,
        name: data.name.trim(),
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MENU_CATEGORY_CREATED',
      entityType: 'MenuCategory',
      entityId: category.id,
      metadata: { name: category.name, restaurantId: category.restaurantId },
    });

    return category;
  }

  async findAllCategories(query: Record<string, any>): Promise<IGenericResponse<MenuCategory[]>> {
    const queryBuilder = new QueryBuilder<MenuCategory>(query, this.prisma.menuCategory);
    const result = (await queryBuilder
      .filter(menuCategoryFilterFields as string[])
      .search(menuCategorySearchFields as string[])
      .nestedFilter(menuCategoryNestedFilters)
      .sort()
      .paginate()
      .include(menuCategoryInclude)
      .fields()
      .filterByRange(menuCategoryRangeFilter)
      .execute()) as MenuCategory[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async findCategory(id: string) {
    const category = await this.prisma.menuCategory.findUnique({ where: { id } });
    if (!category) throw new ApiError(HttpStatus.NOT_FOUND, 'Menu category not found');
    return category;
  }

  async updateCategory(id: string, data: UpdateMenuCategoryDto, actorId: string) {
    const category = await this.findCategory(id);

    const updated = await this.prisma.menuCategory.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MENU_CATEGORY_UPDATED',
      entityType: 'MenuCategory',
      entityId: category.id,
    });

    return updated;
  }

  async deleteCategory(id: string, actorId: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
      include: { _count: { select: { menuItems: true } } },
    });
    if (!category) throw new ApiError(HttpStatus.NOT_FOUND, 'Menu category not found');
    if (category._count.menuItems > 0) throw new ApiError(HttpStatus.CONFLICT, 'Cannot delete category with items');

    await this.prisma.menuCategory.delete({ where: { id } });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MENU_CATEGORY_DELETED',
      entityType: 'MenuCategory',
      entityId: category.id,
    });

    return { message: 'Category deleted successfully' };
  }

  // --- MENU ITEM ---

  async createMenuItem(data: CreateMenuItemDto, actorId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: data.restaurantId } });
    if (!restaurant) throw new ApiError(HttpStatus.NOT_FOUND, 'Restaurant not found');
    const category = await this.prisma.menuCategory.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new ApiError(HttpStatus.NOT_FOUND, 'Category not found');
    if (category.restaurantId !== data.restaurantId) throw new ApiError(HttpStatus.BAD_REQUEST, 'Category does not belong to the restaurant');

    const item = await this.prisma.menuItem.create({
      data: {
        restaurantId: data.restaurantId,
        categoryId: data.categoryId,
        name: data.name.trim(),
        description: data.description,
        basePrice: data.basePrice,
        imageUrl: data.imageUrl,
        isAvailable: data.isAvailable ?? true,
        isVegetarian: data.isVegetarian ?? false,
        spiceLevel: data.spiceLevel ?? 0,
        displayOrder: data.displayOrder ?? 0,
        modifierGroups: data.modifierGroups ? {
          create: data.modifierGroups.map(mg => ({
            name: mg.name.trim(),
            isRequired: mg.isRequired ?? false,
            minSelect: mg.minSelect,
            maxSelect: mg.maxSelect,
          }))
        } : undefined,
      },
      include: { modifierGroups: true },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MENU_ITEM_CREATED',
      entityType: 'MenuItem',
      entityId: item.id,
      metadata: { name: item.name, restaurantId: item.restaurantId },
    });

    return item;
  }

  async findAllMenuItems(query: Record<string, any>): Promise<IGenericResponse<MenuItem[]>> {
    const queryBuilder = new QueryBuilder<MenuItem>(query, this.prisma.menuItem);
    const result = (await queryBuilder
      .filter(menuItemFilterFields as string[])
      .search(menuItemSearchFields as string[])
      .nestedFilter(menuItemNestedFilters)
      .sort()
      .paginate()
      .include(menuItemInclude)
      .fields()
      .filterByRange(menuItemRangeFilter)
      .execute()) as MenuItem[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async findMenuItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        modifierGroups: {
          include: { modifiers: true },
        }
      },
    });
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Menu item not found');
    return item;
  }

  async updateMenuItem(id: string, data: UpdateMenuItemDto, actorId: string) {
    const item = await this.findMenuItem(id);

    const updated = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.name && { name: data.name.trim() }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.isVegetarian !== undefined && { isVegetarian: data.isVegetarian }),
        ...(data.spiceLevel !== undefined && { spiceLevel: data.spiceLevel }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MENU_ITEM_UPDATED',
      entityType: 'MenuItem',
      entityId: item.id,
    });

    return updated;
  }

  async toggleMenuItemAvailability(id: string, isAvailable: boolean, actorId: string) {
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MENU_ITEM_AVAILABILITY_TOGGLED',
      entityType: 'MenuItem',
      entityId: item.id,
      metadata: { isAvailable },
    });
    return item;
  }

  async deleteMenuItem(id: string, actorId: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true } } },
    });
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Menu item not found');
    
    // Soft delete if there are orders, hard delete otherwise.
    // However, schema does not have deletedAt for MenuItem. So we hard delete unless order relations exist.
    // Wait, the plan says "Soft-delete or hard-delete", but there is no `deletedAt` on `MenuItem`.
    // Let's just throw conflict if there are orders, requiring `isAvailable=false` instead of delete.
    if (item._count.orderItems > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Cannot delete item with existing orders. Mark it unavailable instead.');
    }

    await this.prisma.menuItem.delete({ where: { id } });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MENU_ITEM_DELETED',
      entityType: 'MenuItem',
      entityId: item.id,
    });

    return { message: 'Item deleted successfully' };
  }

  // --- MODIFIER GROUP ---

  async addModifierGroup(menuItemId: string, data: CreateModifierGroupDto, actorId: string) {
    if (data.minSelect > data.maxSelect) throw new ApiError(HttpStatus.BAD_REQUEST, 'minSelect cannot be greater than maxSelect');
    
    const mg = await this.prisma.modifierGroup.create({
      data: {
        menuItemId,
        name: data.name.trim(),
        isRequired: data.isRequired ?? false,
        minSelect: data.minSelect,
        maxSelect: data.maxSelect,
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MODIFIER_GROUP_ADDED',
      entityType: 'ModifierGroup',
      entityId: mg.id,
      metadata: { menuItemId },
    });

    return mg;
  }

  async updateModifierGroup(id: string, data: UpdateModifierGroupDto, actorId: string) {
    const mg = await this.prisma.modifierGroup.findUnique({ where: { id } });
    if (!mg) throw new ApiError(HttpStatus.NOT_FOUND, 'Modifier group not found');

    const minSelect = data.minSelect !== undefined ? data.minSelect : mg.minSelect;
    const maxSelect = data.maxSelect !== undefined ? data.maxSelect : mg.maxSelect;
    if (minSelect > maxSelect) throw new ApiError(HttpStatus.BAD_REQUEST, 'minSelect cannot be greater than maxSelect');

    const updated = await this.prisma.modifierGroup.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.isRequired !== undefined && { isRequired: data.isRequired }),
        ...(data.minSelect !== undefined && { minSelect: data.minSelect }),
        ...(data.maxSelect !== undefined && { maxSelect: data.maxSelect }),
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MODIFIER_GROUP_UPDATED',
      entityType: 'ModifierGroup',
      entityId: mg.id,
    });

    return updated;
  }

  async deleteModifierGroup(id: string, actorId: string) {
    const mg = await this.prisma.modifierGroup.findUnique({ where: { id } });
    if (!mg) throw new ApiError(HttpStatus.NOT_FOUND, 'Modifier group not found');
    await this.prisma.modifierGroup.delete({ where: { id } });
    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MODIFIER_GROUP_DELETED',
      entityType: 'ModifierGroup',
      entityId: mg.id,
    });
    return { message: 'Modifier group deleted successfully' };
  }

  // --- MODIFIER ---

  async addModifier(groupId: string, data: CreateModifierDto, actorId: string) {
    const modifier = await this.prisma.modifier.create({
      data: {
        modifierGroupId: groupId,
        name: data.name.trim(),
        priceDelta: data.priceDelta,
        isAvailable: data.isAvailable ?? true,
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MODIFIER_ADDED',
      entityType: 'Modifier',
      entityId: modifier.id,
      metadata: { groupId },
    });

    return modifier;
  }

  async updateModifier(id: string, data: UpdateModifierDto, actorId: string) {
    const modifier = await this.prisma.modifier.findUnique({ where: { id } });
    if (!modifier) throw new ApiError(HttpStatus.NOT_FOUND, 'Modifier not found');

    const updated = await this.prisma.modifier.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.priceDelta !== undefined && { priceDelta: data.priceDelta }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MODIFIER_UPDATED',
      entityType: 'Modifier',
      entityId: modifier.id,
    });

    return updated;
  }

  async deleteModifier(id: string, actorId: string) {
    const modifier = await this.prisma.modifier.findUnique({ where: { id } });
    if (!modifier) throw new ApiError(HttpStatus.NOT_FOUND, 'Modifier not found');
    await this.prisma.modifier.delete({ where: { id } });
    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'MODIFIER_DELETED',
      entityType: 'Modifier',
      entityId: modifier.id,
    });
    return { message: 'Modifier deleted successfully' };
  }
}
