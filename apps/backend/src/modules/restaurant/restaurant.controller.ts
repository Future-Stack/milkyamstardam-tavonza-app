import { Controller, Get, Body, Patch, Param, Delete, Request, HttpStatus, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantResponseDto } from './dto/restaurant-responses.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Organizations & Restaurants')
@ApiBearerAuth('JWT-auth')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get()
  @ApiOperation({ summary: 'List restaurants' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by name, slug or description' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiQuery({ name: 'orgId', required: false, type: String, description: 'Filter by organization ID' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiStandardResponse({
    type: RestaurantResponseDto,
    isArray: true,
    isPaginated: true,
    description: 'List of restaurants',
  })
  async findAll(@Query() query: Record<string, any>) {
    const result = await this.restaurantService.findAll(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Restaurants retrieved successfully',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant details' })
  @ApiStandardResponse({ type: RestaurantResponseDto })
  async findOne(@Param('id') id: string) {
    const result = await this.restaurantService.findOne(id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Restaurant retrieved successfully',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant' })
  @ApiStandardResponse({ type: RestaurantResponseDto })
  async update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto, @Request() req: any) {
    const result = await this.restaurantService.update(id, updateRestaurantDto, req.user.id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Restaurant updated successfully',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete restaurant' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const result = await this.restaurantService.remove(id, req.user.id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: result.message,
    });
  }
}
