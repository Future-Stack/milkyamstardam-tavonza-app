import { Controller, Get, Param, Query, HttpStatus } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogFilterDto, AuditLogResponseDto } from './dto/audit-log.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Audit Log')
@ApiBearerAuth('JWT-auth')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get()
  @ApiOperation({ summary: 'Query audit logs' })
  @ApiStandardResponse({ type: AuditLogResponseDto, isArray: true, isPaginated: true })
  async findAll(@Query() query: AuditLogFilterDto) {
    const result = await this.auditLogService.findAll(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Audit logs retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get(':id')
  @ApiOperation({ summary: 'Get single audit log entry' })
  @ApiStandardResponse({ type: AuditLogResponseDto })
  async findOne(@Param('id') id: string) {
    const result = await this.auditLogService.findOne(id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Audit log retrieved', data: result });
  }
}
