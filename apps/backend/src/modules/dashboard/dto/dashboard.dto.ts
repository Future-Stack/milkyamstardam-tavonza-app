import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class DashboardFilterDto {
  @ApiProperty()
  @IsString()
  branchId: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class DashboardOverviewDto {
  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  avgOrderValue: number;

  @ApiProperty()
  activeTables: number;
}
