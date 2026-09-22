import { PrismaService } from '@/helper/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalRole, Prisma, UserStatus, User } from '@prisma/client';
import { ApiError } from '@/utils/api_error';
import { BcryptService } from '@/utils/bcrypt.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { ConfigService } from '@/config/config.service';
import QueryBuilder from '@/utils/query_builder';
import { userFilterFields, userInclude, userSearchFields } from './user.constant';
import { IGenericResponse } from '@/interface/common';

/** Never leak the password hash on a self-read. */
const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  contactNo: true,
  role: true,
  status: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
    private readonly configService: ConfigService,
  ) {}

  // Admin creation lives in AdminService.create() — it is the single place that
  // guarantees "one admin => exactly one auto-created organization".

  async createCustomer(data: CreateCustomerDto): Promise<any | null> {
    const { customer: customerData, ...userData } = data;

    const result = await this.prisma.$transaction(async (tx) => {
      userData.role = GlobalRole.CUSTOMER;
      if (!userData.password) {
        userData.password = this.configService.get('DEFAULT_CUSTOMER_PASSWORD') || 'customer123456';
      }
      const passwordHash = await this.bcryptService.hash(userData.password);

      const payload: any = { ...userData, passwordHash };
      delete payload.password;

      const isEmailExists = await tx.user.findUnique({ where: { email: payload.email } });
      if (isEmailExists) {
        throw new ApiError(HttpStatus.CONFLICT, `User email already exists`);
      }

      const userCreation = await tx.user.create({ data: payload });

      const customerPayload: any = { ...customerData, user: { connect: { id: userCreation.id } } };
      if (customerData?.defaultAddress) {
        customerPayload.defaultAddress = { set: customerData.defaultAddress };
      }

      const customerCreation = await tx.customer.create({
        data: customerPayload,
      });

      if (!userCreation || !customerCreation) {
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create customer');
      }

      return userCreation;
    });

    return await this.prisma.user.findUnique({
      where: { id: result.id },
      include: { customer: true },
    });
  }

  async getOne(data: { email: string }): Promise<User | any | null> {
    const result = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
      include: {
        customer: true,
      },
    });

    return result;
  }

  async changeStatus(id: string) {
    const isUserExists = await this.prisma.user.findUnique({ where: { id } });

    if (!isUserExists) {
      throw new ApiError(HttpStatus.NOT_FOUND, `user not found`);
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        status: isUserExists.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE,
      },
    });
  }

  async getMany(query: Record<string, any>): Promise<IGenericResponse<User[]>> {
    const queryBuilder = new QueryBuilder(query, this.prisma.user);

    const result = await queryBuilder
      .filter(userFilterFields)
      .search(userSearchFields)
      .sort()
      .paginate()
      .fields()
      .include(userInclude)
      .execute();

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  /**
   * Self-service profile update. Only ever touches the caller's own row — the
   * `userId` comes from the verified JWT, never from the request body.
   */
  async updateMe(userId: string, data: UpdateMeDto, avatar?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const payload: Prisma.UserUpdateInput = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.contactNo !== undefined) payload.contactNo = data.contactNo.trim() || null;
    if (avatar) payload.avatar = avatar;

    if (Object.keys(payload).length === 0) {
      return this.prisma.user.findUnique({
        where: { id: userId },
        select: publicUserSelect,
      });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: payload,
      select: publicUserSelect,
    });
  }

  async updatePassword({ id, password }: { id: string; password: string }) {
    const isUserExists = await this.prisma.user.findUnique({ where: { id } });

    if (!isUserExists) {
      throw new ApiError(HttpStatus.NOT_FOUND, `user not found`);
    }

    const passwordHash = await this.bcryptService.hash(password);

    return await this.prisma.user.update({
      where: { id },
      data: {
        password: passwordHash,
      },
    });
  }
}
