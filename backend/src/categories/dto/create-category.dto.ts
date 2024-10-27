import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './update-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
