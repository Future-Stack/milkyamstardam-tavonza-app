import { PrismaService } from '@/helper/prisma.service';
import { IGenericResponse } from '@/interface/common';
import { ApiError } from '@/utils/api_error';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalRole, User } from '@prisma/client';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import QueryBuilder from '@/utils/query_builder';
import {
  customerFilterFields,
  customerInclude,
  customerNestedFilters,
  customerRangeFilter,
  customerSearchFields,
} from './customer.constant';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, any>): Promise<IGenericResponse<User[]>> {
    const queryBuilder = new QueryBuilder(query, this.prisma.user);
    const result = await queryBuilder
      .filter(customerFilterFields)
      .search(customerSearchFields)
      .nestedFilter(customerNestedFilters)
      .sort()
      .paginate()
      .include(customerInclude)
      .fields()
      .filterByRange(customerRangeFilter)
      .rawFilter({ globalRole: GlobalRole.CUSTOMER })
      .execute();

    const meta = await queryBuilder.countTotal();

    const formattedData = result?.map((item: any) => {
      delete item.passwordHash;
      return item;
    });

    return { meta, data: formattedData || [] };
  }

  async findOne(id: string) {
    let isCustomerExists = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!isCustomerExists) {
      isCustomerExists = await this.prisma.customer.findUnique({
        where: { userId: id },
      });
    }

    if (!isCustomerExists) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Customer Not Found');
    }

    const result = await this.prisma.user.findUnique({
      where: { id: isCustomerExists?.userId },
      include: {
        customer: true,
      },
    });

    if (result) {
      delete (result as any).passwordHash;
    }

    return result;
  }

  async update(id: string, data: UpdateCustomerDto, avatar?: string) {
    const isUserExists = await this.findOne(id);

    const { customer: customerData, ...userData } = data as any;

    await this.prisma.$transaction(async (tx) => {
      if (customerData) {
        const CustomerUpdation = await tx.customer.update({
          where: { id: (isUserExists as any)?.customer?.id },
          data: customerData as any,
        });

        if (!CustomerUpdation) {
          throw new ApiError(HttpStatus.NOT_FOUND, `Customer updation failed`);
        }
      }

      const userUpdatePayload: any = { ...userData };
      if (avatar) {
        userUpdatePayload.avatarUrl = avatar;
      }

      if (Object.keys(userUpdatePayload).length > 0) {
        await tx.user.update({
          where: { id: (isUserExists as any).id },
          data: userUpdatePayload,
        });
      }
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: (isUserExists as any).id },
      include: {
        customer: true,
      },
    });

    if (updatedUser) {
      delete (updatedUser as any).passwordHash;
    }

    return updatedUser;
  }

  async remove(id: string) {
    const isUserExists: any = await this.findOne(id);

    if (!isUserExists) {
      throw new ApiError(HttpStatus.NOT_FOUND, `user not found`);
    }

    await this.prisma.$transaction(
      async (tx) => {
        if (isUserExists?.customer?.id) {
          await tx.customer.delete({
            where: { id: isUserExists.customer.id },
          });
        }

        const userDeletion = await tx.user.delete({
          where: { id: isUserExists.id },
        });
        return userDeletion;
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return 'user deleted successfully';
  }
}
