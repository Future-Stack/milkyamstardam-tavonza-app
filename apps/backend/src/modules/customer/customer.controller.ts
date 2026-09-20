import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Roles } from '../roles/roles.decorator';
import { ResponseService } from '@/utils/response';
import { UpdateCustomerDto } from './dto/update-customer.dto';
// import { CustomFileFieldsInterceptor } from '@/helper/file_interceptor';
import { ParseFormDataInterceptor } from '@/helper/form_data_interceptor';
import { FileService } from '@/helper/file.service';
import { GlobalRole } from '@prisma/client';
import { FileInterceptorInmemory } from '@/helper/file_interceptor_inmemorty';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { CustomerProfileResponseDto } from './dto/customer-responses.dto';

@ApiTags('Customer')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly CustomerService: CustomerService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  @Roles(GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.CUSTOMER)
  @ApiOperation({ summary: 'Find all Customers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiStandardResponse({
    type: CustomerProfileResponseDto,
    isArray: true,
    isPaginated: true,
    description: 'List of customers',
  })
  async findAll(@Query() query: Record<string, any>) {
    const result = await this.CustomerService.findAll(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Customers Found successfully',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Get(':id')
  @Roles(GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.CUSTOMER)
  @ApiOperation({ summary: 'Get a specific customer by ID' })
  @ApiStandardResponse({ type: CustomerProfileResponseDto, description: 'Customer details' })
  async findOne(@Param('id') id: string) {
    const result = await this.CustomerService.findOne(id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Customer Found successfully',
      data: result,
    });
  }

  @Patch(':id')
  @Roles(GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.CUSTOMER)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', nullable: true },
        fullName: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        avatar: { type: 'string', format: 'binary', nullable: true },
        'customer[loyaltyPoints]': { type: 'number', nullable: true },
        'customer[defaultAddress][street]': { type: 'string', nullable: true },
        'customer[defaultAddress][city]': { type: 'string', nullable: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptorInmemory([{ name: 'avatar', maxCount: 1 }]),
    ParseFormDataInterceptor,
  )
  @ApiStandardResponse({
    type: CustomerProfileResponseDto,
    description: 'Customer updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    let avatar: string | undefined;

    const uploadableFile = files?.avatar;

    if (Array.isArray(uploadableFile) && uploadableFile.length > 0) {
      const uploaded = await this.fileService.uploadMultipleToS3(uploadableFile);

      avatar = uploaded[0];
    }

    const result = await this.CustomerService.update(id, updateCustomerDto, avatar);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Customer Updated successfully',
      data: result,
    });
  }

  @Delete(':id')
  @Roles(GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.CUSTOMER)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiStandardResponse({
    type: CustomerProfileResponseDto,
    description: 'Customer deleted successfully',
  })
  async remove(@Param('id') id: string) {
    const result = await this.CustomerService.remove(id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Customer Deleted successfully',
      data: result,
    });
  }
}
