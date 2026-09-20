import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationResponseDto } from './dto/organization-responses.dto';
import { CreateRestaurantDto } from '../restaurant/dto/create-restaurant.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { RestaurantResponseDto } from '../restaurant/dto/restaurant-responses.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { FileService } from '@/helper/file.service';
import { ParseFormDataInterceptor } from '@/helper/form_data_interceptor';

@ApiTags('Organizations & Restaurants')
@ApiBearerAuth('JWT-auth')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly restaurantService: RestaurantService,
    private readonly fileService: FileService,
  ) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create an organization',
    description:
      'Creates a new organization. If created by an ADMIN for himself, ownerId is not needed and defaults to the admin. If created by a SUPER_ADMIN, ownerId is required.',
  })
  @ApiStandardResponse({ type: OrganizationResponseDto })
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @Request() req: any) {
    const result = await this.organizationService.create(createOrganizationDto, req.user);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Organization created successfully',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'List organizations',
    description: 'Paginated list of organizations. SUPER_ADMIN sees all; ADMIN sees only their own.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by name or slug' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiStandardResponse({
    type: OrganizationResponseDto,
    isArray: true,
    isPaginated: true,
    description: 'List of organizations',
  })
  async findAll(@Query() query: Record<string, any>, @Request() req: any) {
    const result = await this.organizationService.findAll(query, req.user);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Organizations retrieved successfully',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get organization details',
    description: 'Retrieves organization details. SUPER_ADMIN can access any organization; ADMIN can only access their own.',
  })
  @ApiStandardResponse({ type: OrganizationResponseDto })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const result = await this.organizationService.findOne(id, req.user);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Organization retrieved successfully',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update organization',
    description: 'Updates organization details. SUPER_ADMIN can update any organization; ADMIN can only update their own.',
  })
  @ApiStandardResponse({ type: OrganizationResponseDto })
  async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @Request() req: any) {
    const result = await this.organizationService.update(id, updateOrganizationDto, req.user);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Organization updated successfully',
      data: result,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Deletes an organization. SUPER_ADMIN can delete any; ADMIN can only delete their own if no active restaurants.',
  })
  async remove(@Param('id') id: string, @Request() req: any) {
    const result = await this.organizationService.remove(id, req.user);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: result.message,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN)
  @Post(':orgId/restaurants')
  @ApiOperation({
    summary: 'Create a restaurant under an organization',
    description: 'Creates a restaurant under the organization. Verified to ensure ADMIN can only create under their own organization.',
  })
  @ApiParam({ name: 'orgId', example: '68ad69a250ceb2da150c3127' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: { type: 'string', format: 'binary', nullable: true },
        data: {
          type: 'object',
          description:
            'JSON-encoded restaurant fields to create (parsed from the multipart `data` part by ParseFormDataInterceptor)',
          properties: {
            name: { type: 'string', example: 'Golden Corral Buffet' },
            slug: { type: 'string', example: 'golden-corral', nullable: true },
            description: { type: 'string', example: 'A great place to eat', nullable: true },
            isActive: { type: 'boolean', example: true, nullable: true },
            logoUrl: { type: 'string', example: 'https://cdn.example.com/logo.png', nullable: true },
          },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
    ]),
    ParseFormDataInterceptor,
  )
  @ApiStandardResponse({ type: RestaurantResponseDto })
  async createRestaurant(
    @Param('orgId') orgId: string,
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Request() req: any,
  ) {
    let logo: string | undefined;

    const uploadableFiles = files?.logo;
    if (Array.isArray(uploadableFiles) && uploadableFiles.length > 0) {
      const uploaded = await this.fileService.uploadMultipleToS3(uploadableFiles);
      logo = uploaded[0];
    }

    if (logo) {
      createRestaurantDto.logoUrl = logo;
    }

    const org = await this.organizationService.findOne(orgId, req.user);
    const result = await this.restaurantService.create(org.id, createRestaurantDto, req.user.id, logo);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Restaurant created successfully',
      data: result,
    });
  }
}
