import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class MetaDataDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 50 })
  total: number;
}

export class GenericResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiPropertyOptional({ type: () => MetaDataDto })
  meta?: MetaDataDto;

  data?: T;
}

export const ApiStandardResponse = <DataDto extends Type<unknown>>(options: {
  type?: DataDto;
  isArray?: boolean;
  description?: string;
  isPaginated?: boolean;
}) => {
  const decorators = [ApiExtraModels(GenericResponseDto, MetaDataDto)];
  if (options.type) {
    decorators.push(ApiExtraModels(options.type));
  }

  decorators.push(
    ApiOkResponse({
      description: options.description || 'Successful operation',
      schema: {
        allOf: [
          { $ref: getSchemaPath(GenericResponseDto) },
          {
            properties: {
              ...(options.type && {
                data: options.isArray
                  ? {
                      type: 'array',
                      items: { $ref: getSchemaPath(options.type) },
                    }
                  : {
                      $ref: getSchemaPath(options.type),
                    },
              }),
              ...(options.isPaginated && {
                meta: {
                  $ref: getSchemaPath(MetaDataDto),
                },
              }),
            },
          },
        ],
      },
    }),
  );

  return applyDecorators(...decorators);
};
