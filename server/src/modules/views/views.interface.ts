/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export interface ViewsRequestBody {
  workspaceId: string;
}

export enum FilterTypeEnum {
  IS = 'IS',
  IS_NOT = 'IS_NOT',
  INCLUDES = 'INCLUDLES',
  INCLUDES_ANY = 'INCLUDES_ANY',
  EXCLUDES = 'EXCLUDES',
  EXCLUDES_ANY = 'EXCLUDES_ANY',
  UNDEFINED = 'UNDEFINED',
}

export class FilterModelType {
  @IsArray()
  @Type(() => String)
  value: string[];

  @IsEnum(FilterTypeEnum)
  filterType: FilterTypeEnum;
}

export class FiltersModelType {
  [key: string]: FilterModelType;
}

export class CreateViewsRequestBody {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FiltersModelType)
  filters: FiltersModelType;

  @IsString()
  workspaceId: string;
}

export class UpdateViewsRequestBody {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FiltersModelType)
  filters?: FiltersModelType;

  @IsString()
  viewId: string;
}

export class ViewRequestIdBody {
  @IsString()
  viewId: string;
}
