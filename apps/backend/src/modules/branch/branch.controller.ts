import { Controller, Get, Body, Patch, Param, Delete, Post, Request, HttpStatus, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchResponseDto } from './dto/branch-responses.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Branches')
@ApiBearerAuth('JWT-auth')
@Controller('restaurants/:restId/branches')
export class BranchRestaurantController {
  constructor(private readonly branchService: BranchService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create a branch for a restaurant' })
  @ApiStandardResponse({ type: BranchResponseDto })
  async create(
    @Param('restId') restId: string,
    @Body() createBranchDto: CreateBranchDto,
    @Request() req: any
  ) {
    const result = await this.branchService.create(restId, createBranchDto, req.user.id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Branch created successfully',
      data: result,
    });
  }
}

@ApiTags('Branches')
@ApiBearerAuth('JWT-auth')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get()
  @ApiOperation({ summary: 'List branches' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by name, phone or timezone' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiQuery({ name: 'restaurantId', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiStandardResponse({
    type: BranchResponseDto,
    isArray: true,
    isPaginated: true,
    description: 'List of branches',
  })
  async findAll(@Query() query: Record<string, any>) {
    const result = await this.branchService.findAll(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Branches retrieved successfully',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get(':id')
  @ApiOperation({ summary: 'Get branch details' })
  @ApiStandardResponse({ type: BranchResponseDto })
  async findOne(@Param('id') id: string) {
    const result = await this.branchService.findOne(id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Branch retrieved successfully',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update branch' })
  @ApiStandardResponse({ type: BranchResponseDto })
  async update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto, @Request() req: any) {
    const result = await this.branchService.update(id, updateBranchDto, req.user.id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Branch updated successfully',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete branch' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const result = await this.branchService.remove(id, req.user.id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: result.message,
    });
  }
}
