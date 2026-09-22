import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GrowthQueryDto {
  @ApiPropertyOptional({
    example: 30,
    description: 'How many days of history to return (1–365). Defaults to 30.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number;
}

export class OrganizationStatsDto {
  @ApiProperty({ example: 12 })
  total: number;

  @ApiProperty({ example: 3, description: 'Created in the last 30 days' })
  newLast30Days: number;
}

export class RestaurantStatsDto {
  @ApiProperty({ example: 20 })
  total: number;

  @ApiProperty({ example: 18 })
  active: number;

  @ApiProperty({ example: 6, description: 'Organizations that own no restaurant yet' })
  organizationsWithoutRestaurant: number;
}

export class BranchStatsDto {
  @ApiProperty({ example: 34 })
  total: number;

  @ApiProperty({ example: 30 })
  active: number;
}

export class AdminStatsDto {
  @ApiProperty({ example: 12 })
  total: number;

  @ApiProperty({ example: 11 })
  active: number;

  @ApiProperty({ example: 1 })
  inactive: number;

  @ApiProperty({ example: 3, description: 'Created in the last 30 days' })
  newLast30Days: number;
}

export class UserRoleCountDto {
  @ApiProperty({ example: 'CUSTOMER' })
  role: string;

  @ApiProperty({ example: 404 })
  count: number;
}

export class UserStatsDto {
  @ApiProperty({ example: 480 })
  total: number;

  @ApiProperty({ example: 12, description: 'Distinct customers created in the last 30 days' })
  newLast30Days: number;

  @ApiProperty({ type: [UserRoleCountDto] })
  byRole: UserRoleCountDto[];
}

export class OnboardingStatsDto {
  @ApiProperty({ example: 4, description: 'Admins owning an organization with no restaurant' })
  adminsWithoutRestaurant: number;

  @ApiProperty({ example: 7, description: 'Admins owning no branch yet — the furthest behind' })
  adminsWithoutBranch: number;

  @ApiProperty({
    example: 66.7,
    description: 'Share of admins that have at least one live branch, as a percentage',
  })
  completionRate: number;
}

export class ActivityStatsDto {
  @ApiProperty({ example: 41, description: 'Audit entries written in the last 24 hours' })
  auditEventsLast24h: number;

  @ApiProperty({ example: 12, description: 'Distinct users who acted in the last 24 hours' })
  activeActorsLast24h: number;
}

export class AnalyticsOverviewDto {
  @ApiProperty({ type: OrganizationStatsDto })
  organizations: OrganizationStatsDto;

  @ApiProperty({ type: RestaurantStatsDto })
  restaurants: RestaurantStatsDto;

  @ApiProperty({ type: BranchStatsDto })
  branches: BranchStatsDto;

  @ApiProperty({ type: AdminStatsDto })
  admins: AdminStatsDto;

  @ApiProperty({ type: UserStatsDto })
  users: UserStatsDto;

  @ApiProperty({ type: OnboardingStatsDto })
  onboarding: OnboardingStatsDto;

  @ApiProperty({ type: ActivityStatsDto })
  activity: ActivityStatsDto;
}

export class GrowthPointDto {
  @ApiProperty({ example: '2026-08-24' })
  date: string;

  @ApiProperty({ example: 1 })
  organizations: number;

  @ApiProperty({ example: 1 })
  admins: number;
}

export class GrowthResponseDto {
  @ApiProperty({ example: 30 })
  days: number;

  @ApiProperty({
    type: [GrowthPointDto],
    description:
      'One entry per day in the window, including empty days, so the series can be charted directly.',
  })
  series: GrowthPointDto[];

  @ApiProperty({
    example: { organizations: 3, admins: 3, customers: 120 },
    description: 'Window totals; customers is a count only to avoid scanning every user document.',
  })
  totals: { organizations: number; admins: number; customers: number };
}
