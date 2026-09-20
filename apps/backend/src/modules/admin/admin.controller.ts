import { FileService } from '@/helper/file.service';
import { ParseFormDataInterceptor } from '@/helper/form_data_interceptor';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GlobalRole, UserStatus } from '@prisma/client';
import { Roles } from '../roles/roles.decorator';
import { AdminService } from './admin.service';
import {
  AdminProfileResponseDto,
  DeletedAdminResponseDto,
} from './dto/admin-responses.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

/**
 * Super Admin dashboard — platform admin management.
 * Every route requires a SUPER_ADMIN bearer token.
 */
@ApiTags('Super Admin - Admin Management')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
@ApiForbiddenResponse({ description: 'Caller is not a SUPER_ADMIN' })
@Roles(GlobalRole.SUPER_ADMIN)
@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create an admin user (SUPER_ADMIN only)',
    description:
      'Creates a platform ADMIN and automatically creates exactly one organization owned by ' +
      "and named after that admin. Pass `organizationName` to override the organization's name.",
  })
  @ApiBody({ type: CreateAdminDto })
  @ApiCreatedResponse({ type: AdminProfileResponseDto, description: 'Admin created successfully' })
  @ApiStandardResponse({
    type: AdminProfileResponseDto,
    description: 'Admin created successfully with one auto-created organization',
  })
  async create(@Body() createAdminDto: CreateAdminDto) {
    const result = await this.adminService.create(createAdminDto);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Admin created successfully',
      data: result,
    });
  }

  @Get()
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'List all admin users (SUPER_ADMIN only)',
    description: 'Paginated list of every ADMIN on the platform, with their owned organizations.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Name/email/contact' })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiStandardResponse({
    type: AdminProfileResponseDto,
    isArray: true,
    isPaginated: true,
    description: 'List of admins',
  })
  async findAll(@Query() query: Record<string, any>) {
    const result = await this.adminService.findAll(query);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Admins Found successfully',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Get(':id')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get one admin by id (SUPER_ADMIN only)' })
  @ApiParam({ name: 'id', example: '68ad69a250ceb2da150c3127' })
  @ApiStandardResponse({ type: AdminProfileResponseDto, description: 'Admin details' })
  async findOne(@Param('id') id: string) {
    const result = await this.adminService.findOne(id);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Admin Found successfully',
      data: result,
    });
  }

  @Patch(':id')
  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @ApiOperation({ summary: 'Update an admin (SUPER_ADMIN only)' })
  @ApiParam({ name: 'id', example: '68ad69a250ceb2da150c3127' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary', nullable: true },
        data: {
          type: 'object',
          description:
            'JSON-encoded admin fields to update (parsed from the multipart `data` part by ParseFormDataInterceptor)',
          properties: {
            email: { type: 'string', nullable: true, example: 'rose@mailinator.com' },
            name: { type: 'string', nullable: true, example: 'Rose Ahmed' },
            contactNo: { type: 'string', nullable: true, example: '+8801700000001' },
            status: { type: 'string', enum: Object.values(UserStatus), nullable: true },
            intro: {
              type: 'string',
              nullable: true,
              example: 'Platform admin responsible for restaurant onboarding and compliance.',
            },
          },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]),
    ParseFormDataInterceptor,
  )
  @ApiStandardResponse({ type: AdminProfileResponseDto, description: 'Admin updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    let avatar: string | undefined;

    const uploadableFiles = files?.avatar;
    if (Array.isArray(uploadableFiles) && uploadableFiles.length > 0) {
      const uploaded = await this.fileService.uploadMultipleToS3(uploadableFiles);
      avatar = uploaded[0];
    }

    const result = await this.adminService.update(id, updateAdminDto, avatar);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Admin Updated successfully',
      data: result,
    });
  }

  @Patch(':id/status')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Toggle an admin between ACTIVE and INACTIVE (SUPER_ADMIN only)',
    description: 'How a super admin suspends or restores an admin without deleting the account.',
  })
  @ApiParam({ name: 'id', example: '68ad69a250ceb2da150c3127' })
  @ApiStandardResponse({
    type: AdminProfileResponseDto,
    description: 'Admin status updated successfully',
  })
  async changeStatus(@Param('id') id: string) {
    const result = await this.adminService.changeStatus(id);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Admin status updated successfully',
      data: result,
    });
  }

  @Delete(':id')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Delete an admin (SUPER_ADMIN only)',
    description:
      'Removes the admin, their admin profile and their owned organizations. Returns 409 if an ' +
      'owned organization still has restaurants.',
  })
  @ApiParam({ name: 'id', example: '68ad69a250ceb2da150c3127' })
  @ApiStandardResponse({
    type: DeletedAdminResponseDto,
    description: 'Admin deleted successfully',
  })
  async remove(@Param('id') id: string) {
    const result = await this.adminService.remove(id);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Admin Deleted successfully',
      data: result,
    });
  }
}
