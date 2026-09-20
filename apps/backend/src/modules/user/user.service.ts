import { PrismaService } from '@/helper/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalRole, UserStatus, User } from '@prisma/client';
import { ApiError } from '@/utils/api_error';
import { BcryptService } from '@/utils/bcrypt.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ConfigService } from '@/config/config.service';
import QueryBuilder from '@/utils/query_builder';
import { userFilterFields, userInclude, userSearchFields } from './user.constant';
import { IGenericResponse } from '@/interface/common';

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
