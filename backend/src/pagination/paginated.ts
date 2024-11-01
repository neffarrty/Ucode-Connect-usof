import { applyDecorators, Type } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiOkResponse,
	ApiProperty,
	ApiQuery,
	getSchemaPath,
} from '@nestjs/swagger';
import { PaginationMetadata } from './pagination-metadata';

export class Paginated<T> {
	@ApiProperty()
	data: T[];

	@ApiProperty()
	meta: PaginationMetadata;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
	model: TModel,
) => {
	return applyDecorators(
		ApiExtraModels(Paginated),
		ApiOkResponse({
			description: 'Successfully received paginated list',
			schema: {
				allOf: [
					{ $ref: getSchemaPath(Paginated) },
					{
						properties: {
							data: {
								type: 'array',
								items: { $ref: getSchemaPath(model) },
							},
							meta: {
								type: 'object',
								items: {
									$ref: getSchemaPath(PaginationMetadata),
								},
							},
						},
					},
				],
			},
		}),
	);
};
