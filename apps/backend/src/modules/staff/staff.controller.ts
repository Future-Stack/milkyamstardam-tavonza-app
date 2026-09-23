import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffAssignmentDto, CreateUserDto, StaffAssignmentResponseDto, UpdateStaffAssignmentDto, StaffUserResponseDto } from './dto/staff.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Users & Staff')
@ApiBearerAuth('JWT-auth')
@Controller()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  /**
   * No `@Roles` on purpose: every authenticated user may ask which branches they
   * are assigned to. Non-staff accounts simply get an empty list.
   */
  @Get('me/assignments')
  @ApiOperation({
    summary: "The caller's own branch assignments",
    description:
      'Branches the caller is staffed at, with their StaffRole and granted permissions. ' +
      'This is what lets a branch or regional manager discover the branches they manage.',
  })
  @ApiStandardResponse({ type: StaffAssignmentResponseDto, isArray: true })
  async findMyAssignments(@Request() req: any) {
    const result = await this.staffService.findMyAssignments(req.user.id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Assignments retrieved',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Post('users')
  @ApiOperation({ summary: 'Create platform user' })
  @ApiStandardResponse({ type: StaffUserResponseDto })
  async createUser(@Body() dto: CreateUserDto, @Request() req: any) {
    const result = await this.staffService.createUser(dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'User created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Get('users')
  @ApiOperation({ summary: 'List platform users' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by name, email or contact' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiQuery({ name: 'role', required: false, enum: GlobalRole })
  @ApiStandardResponse({ type: StaffUserResponseDto, isArray: true, isPaginated: true })
  async findAllUsers(@Query() query: Record<string, any>) {
    const result = await this.staffService.findAllUsers(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Users retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Post('branches/:branchId/staff')
  @ApiOperation({ summary: 'Assign staff to branch' })
  @ApiStandardResponse({ type: StaffAssignmentResponseDto })
  async assignStaff(@Param('branchId') branchId: string, @Body() dto: CreateStaffAssignmentDto, @Request() req: any) {
    const result = await this.staffService.assignStaff(branchId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Staff assigned', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get('branches/:branchId/staff')
  @ApiOperation({ summary: 'List staff for a branch' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by staff name' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiStandardResponse({ type: StaffAssignmentResponseDto, isArray: true, isPaginated: true })
  async findStaffByBranch(@Param('branchId') branchId: string, @Query() query: Record<string, any> = {}) {
    const result = await this.staffService.findStaffByBranch(branchId, query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Staff assignments retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('staff-assignments/:id')
  @ApiOperation({ summary: 'Update staff assignment' })
  @ApiStandardResponse({ type: StaffAssignmentResponseDto })
  async updateStaffAssignment(@Param('id') id: string, @Body() dto: UpdateStaffAssignmentDto, @Request() req: any) {
    const result = await this.staffService.updateStaffAssignment(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Staff assignment updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Delete('staff-assignments/:id')
  @ApiOperation({ summary: 'Remove staff assignment' })
  async removeStaffAssignment(@Param('id') id: string, @Request() req: any) {
    const result = await this.staffService.removeStaffAssignment(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: result.message });
  }
}
