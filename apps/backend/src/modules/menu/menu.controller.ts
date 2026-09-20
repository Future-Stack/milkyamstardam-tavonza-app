import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuCategoryDto, UpdateMenuCategoryDto, MenuCategoryResponseDto } from './dto/menu-category.dto';
import { CreateMenuItemDto, UpdateMenuItemDto, MenuItemResponseDto } from './dto/menu-item.dto';
import { CreateModifierGroupDto, UpdateModifierGroupDto, CreateModifierDto, UpdateModifierDto } from './dto/modifier.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Menu')
@ApiBearerAuth('JWT-auth')
@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // --- MENU CATEGORY ---

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Post('menu-categories')
  @ApiOperation({ summary: 'Create menu category' })
  @ApiStandardResponse({ type: MenuCategoryResponseDto })
  async createCategory(@Body() dto: CreateMenuCategoryDto, @Request() req: any) {
    const result = await this.menuService.createCategory(dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Category created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get('menu-categories')
  @ApiOperation({ summary: 'List menu categories' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by name or description' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'displayOrder' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiStandardResponse({ type: MenuCategoryResponseDto, isArray: true, isPaginated: true })
  async findAllCategories(@Query() query: Record<string, any>) {
    const result = await this.menuService.findAllCategories(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Categories retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get('menu-categories/:id')
  @ApiOperation({ summary: 'Get menu category' })
  @ApiStandardResponse({ type: MenuCategoryResponseDto })
  async findCategory(@Param('id') id: string) {
    const result = await this.menuService.findCategory(id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Category retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('menu-categories/:id')
  @ApiOperation({ summary: 'Update menu category' })
  @ApiStandardResponse({ type: MenuCategoryResponseDto })
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateMenuCategoryDto, @Request() req: any) {
    const result = await this.menuService.updateCategory(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Category updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Delete('menu-categories/:id')
  @ApiOperation({ summary: 'Delete menu category' })
  async deleteCategory(@Param('id') id: string, @Request() req: any) {
    const result = await this.menuService.deleteCategory(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: result.message });
  }

  // --- MENU ITEM ---

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Post('menu-items')
  @ApiOperation({ summary: 'Create menu item (with optional modifierGroups inline)' })
  @ApiStandardResponse({ type: MenuItemResponseDto })
  async createItem(@Body() dto: CreateMenuItemDto, @Request() req: any) {
    const result = await this.menuService.createMenuItem(dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Item created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get('menu-items')
  @ApiOperation({ summary: 'List menu items' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by name or description' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'displayOrder' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'isAvailable', required: false, type: Boolean })
  @ApiQuery({ name: 'isVegetarian', required: false, type: Boolean })
  @ApiStandardResponse({ type: MenuItemResponseDto, isArray: true, isPaginated: true })
  async findAllItems(@Query() query: Record<string, any>) {
    const result = await this.menuService.findAllMenuItems(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Items retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get('menu-items/:id')
  @ApiOperation({ summary: 'Get menu item with modifiers' })
  @ApiStandardResponse({ type: MenuItemResponseDto })
  async findItem(@Param('id') id: string) {
    const result = await this.menuService.findMenuItem(id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Item retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('menu-items/:id')
  @ApiOperation({ summary: 'Update menu item' })
  @ApiStandardResponse({ type: MenuItemResponseDto })
  async updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto, @Request() req: any) {
    const result = await this.menuService.updateMenuItem(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Item updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('menu-items/:id/availability')
  @ApiOperation({ summary: 'Toggle menu item availability' })
  @ApiStandardResponse({ type: MenuItemResponseDto })
  async toggleAvailability(@Param('id') id: string, @Body('isAvailable') isAvailable: boolean, @Request() req: any) {
    const result = await this.menuService.toggleMenuItemAvailability(id, isAvailable, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Item availability updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Delete('menu-items/:id')
  @ApiOperation({ summary: 'Delete menu item' })
  async deleteItem(@Param('id') id: string, @Request() req: any) {
    const result = await this.menuService.deleteMenuItem(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: result.message });
  }

  // --- MODIFIER GROUP ---

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Post('menu-items/:id/modifier-groups')
  @ApiOperation({ summary: 'Add modifier group to item' })
  async addModifierGroup(@Param('id') menuItemId: string, @Body() dto: CreateModifierGroupDto, @Request() req: any) {
    const result = await this.menuService.addModifierGroup(menuItemId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Modifier group added', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('modifier-groups/:id')
  @ApiOperation({ summary: 'Update modifier group' })
  async updateModifierGroup(@Param('id') id: string, @Body() dto: UpdateModifierGroupDto, @Request() req: any) {
    const result = await this.menuService.updateModifierGroup(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Modifier group updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Delete('modifier-groups/:id')
  @ApiOperation({ summary: 'Delete modifier group' })
  async deleteModifierGroup(@Param('id') id: string, @Request() req: any) {
    const result = await this.menuService.deleteModifierGroup(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: result.message });
  }

  // --- MODIFIER ---

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Post('modifier-groups/:id/modifiers')
  @ApiOperation({ summary: 'Add modifier to group' })
  async addModifier(@Param('id') groupId: string, @Body() dto: CreateModifierDto, @Request() req: any) {
    const result = await this.menuService.addModifier(groupId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Modifier added', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('modifiers/:id')
  @ApiOperation({ summary: 'Update modifier' })
  async updateModifier(@Param('id') id: string, @Body() dto: UpdateModifierDto, @Request() req: any) {
    const result = await this.menuService.updateModifier(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Modifier updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Delete('modifiers/:id')
  @ApiOperation({ summary: 'Delete modifier' })
  async deleteModifier(@Param('id') id: string, @Request() req: any) {
    const result = await this.menuService.deleteModifier(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: result.message });
  }
}
