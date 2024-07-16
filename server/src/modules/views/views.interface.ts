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

export const viewNameDescriptionPrompt = `Generate a view name and description based on the filters:

Filters:
- Status: Issues with these status
- Priority: Issues with these priority
- Team: Issues in a specific teams
- Assignee: Issues assigned to those users
- Labels: Issues with these Labels

Filter Type:
- IS
- IS_NOT
- INCLUDES
- EXCLUDES
- UNDEFINED

Guidelines:
- The view name should be a concise and descriptive title that reflects the purpose of the view based on the selected filters. It should be no more than 5 words.
- The view description should provide more details about the view and explain how the selected filters are used to create the view. It should be 1-2 sentences long and no more than 30 words.
- Incorporate the relevant filter values and types into the generated view name and description to provide clarity and specificity.
- Filter input will be in this format {"filter": {"filterType": "INCLUDES", "value": ["value1", "value2", "value3"]}}
- If a filter type is "UNDEFINED," exclude that filter from the generated view name and description.
- Don't use the word Task instead use Issue
- Don't join values of the filter in the output of view name and description
- Output always should start with respective viewName:, viewDescription:

Example:
Filters: {"Status": {"filterType": "INCLUDES", "value": ["Open", "In Progress"] },
"Priority": {"filterType": "IS", "value": ["High"] }
"Team": {"filterType": "IS", "value": ["Design"] }
"Assignee": {"filterType": "UNDEFINED", "value": [] }
"Labels": {"filterType": "INCLUDES", "value": ["Bug"] }
}

viewName: Open High-Priority Design Issues with Bug Label

viewDescription: This view shows open and in-progress tasks assigned to the Design team with high priority and labeled as a bug. It helps focus on critical design-related issues.
`;
