import { Public } from '@/modules/auth/auth.decorator';
import { ResponseService } from '@/utils/response';
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { UserResponseDto } from './dto/user-responses.dto';
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { AdminProfileResponseDto } from '../admin/dto/admin-responses.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly adminService: AdminService,
  ) {}

  @Post('create-admin')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Create Admin User (SUPER_ADMIN only)',
    description:
      'Alias of `POST /admins`. Creates an ADMIN and auto-creates exactly one organization ' +
      "owned by and named after that admin. Only a SUPER_ADMIN may call this.",
  })
  @ApiBody({ type: CreateAdminDto })
  @ApiStandardResponse({
    type: AdminProfileResponseDto,
    description: 'Admin created successfully with one auto-created organization',
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const result = await this.adminService.create(createAdminDto);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: `Admin created successfully`,
      data: result,
    });
  }

  @Public()
  @Post('create-customer')
  @ApiOperation({ summary: 'Create Customer User' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiStandardResponse({ type: UserResponseDto, description: 'Customer created successfully' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const result = await this.usersService.createCustomer(createCustomerDto);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: `Customer created successfully`,
      data: result,
    });
  }

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Find all Users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: GlobalRole })
  @ApiStandardResponse({
    type: UserResponseDto,
    isArray: true,
    isPaginated: true,
    description: 'List of users',
  })
  async getUsers(@Req() req: Request) {
    const result = await this.usersService.getMany(req?.query as Record<string, string>);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'user retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }

  @Get(':id')
  @Roles(GlobalRole.ADMIN)
  @ApiOperation({ summary: 'Get a specific user by email or ID' })
  @ApiStandardResponse({ type: UserResponseDto, description: 'User details' })
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.getOne({ email: id });
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'user retrieved successfully',
      data: result,
    });
  }

  @Patch('status/:id')
  @Roles(GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Toggle user status (Active/Inactive)' })
  @ApiStandardResponse({ type: UserResponseDto, description: 'User status updated successfully' })
  async changeStatus(@Param('id') id: string) {
    const result = await this.usersService.changeStatus(id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'user status updated successfully',
      data: result,
    });
  }
}
