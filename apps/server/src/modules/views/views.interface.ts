import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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
  INCLUDES = 'INCLUDES',
  EXCLUDES = 'EXCLUDES',
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
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FiltersModelType)
  filters: FiltersModelType;

  @IsString()
  workspaceId: string;

  @IsString()
  @IsOptional()
  teamId?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
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

  @IsBoolean()
  @IsOptional()
  isBookmarked?: boolean;
}

export class ViewRequestIdBody {
  @IsString()
  viewId: string;
}
