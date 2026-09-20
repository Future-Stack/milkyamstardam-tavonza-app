import { ApiProperty } from '@nestjs/swagger';
import { GlobalRole, UserStatus } from '@prisma/client';

export class AdminOrganizationDto {
  @ApiProperty({ example: '68ad69a250ceb2da150c3140' })
  id: string;

  @ApiProperty({ example: 'Rose Ahmed', description: "Organization name (the admin's name)" })
  name: string;

  @ApiProperty({ example: '68ad69a250ceb2da150c3127', description: 'Owning admin user id' })
  ownerId: string;

  @ApiProperty({ example: '2026-08-26T10:15:00.000Z' })
  createdAt: Date;
}

export class AdminRelationDto {
  @ApiProperty({
    example: 'Platform admin responsible for restaurant onboarding and compliance.',
    description: 'Admin profile intro/description (stored on the 1:1 Admin record).',
  })
  intro: string;
}

export class AdminProfileResponseDto {
  @ApiProperty({ example: '68ad69a250ceb2da150c3127' })
  id: string;

  @ApiProperty({ example: 'rose@mailinator.com' })
  email: string;

  @ApiProperty({ example: 'Rose Ahmed' })
  name: string;

  @ApiProperty({ example: '+8801700000001', required: false, nullable: true })
  contactNo?: string | null;

  @ApiProperty({ enum: GlobalRole, example: GlobalRole.ADMIN })
  role: GlobalRole;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ example: null, required: false, nullable: true })
  avatar?: string | null;

  @ApiProperty({
    type: [AdminOrganizationDto],
    description: 'Organizations owned by this admin. Exactly one is auto-created at creation time.',
  })
  ownedOrganizations: AdminOrganizationDto[];

  @ApiProperty({
    type: AdminRelationDto,
    nullable: true,
    description: 'The 1:1 admin profile record (holds `intro`).',
  })
  admin?: AdminRelationDto | null;

  @ApiProperty({ example: '2026-08-26T10:15:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-08-26T10:15:00.000Z' })
  updatedAt: Date;
}

export class DeletedAdminResponseDto {
  @ApiProperty({ example: '68ad69a250ceb2da150c3127' })
  id: string;

  @ApiProperty({ example: 'rose@mailinator.com' })
  email: string;

  @ApiProperty({ example: 1, description: 'Number of owned organizations removed with the admin' })
  deletedOrganizations: number;
}
