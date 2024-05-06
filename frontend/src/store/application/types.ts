/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface UpdateBody {
  filters: Partial<FiltersModelType>;
}

export interface DisplaySettingsModelType {
  view: ViewEnum;
  grouping: GroupingEnum;
  ordering: OrderingEnum;
  showSubIssues: boolean;
  showEmptyGroups: boolean;
  showTriageIssues: boolean;
  showCompletedIssues: boolean;
}

export interface UpdateDisplaySettingsBody
  extends Partial<DisplaySettingsModelType> {}

export enum FilterTypeEnum {
  IS = 'IS',
  IS_NOT = 'IS_NOT',
  INCLUDES = 'INCLUDLES',
  INCLUDES_ANY = 'INCLUDES_ANY',
  EXCLUDES = 'EXCLUDES',
  EXCLUDES_ANY = 'EXCLUDES_ANY',
  UNDEFINED = 'UNDEFINED',
}

export interface FilterModelType {
  value: string[];
  filterType: FilterTypeEnum;
}

export interface FilterModelBooleanType {
  filterType: FilterTypeEnum;
}

export interface FilterModelBooleanType {
  filterType: FilterTypeEnum;
}

export interface FiltersModelType {
  assignee?: FilterModelType;
  status?: FilterModelType;
  label?: FilterModelType;
  priority?: FilterModelType;

  // For issues coming from Slack, Github
  source?: FilterModelType;

  isParent?: FilterModelBooleanType;
  isSubIssue?: FilterModelBooleanType;
  isBlocked?: FilterModelBooleanType;
  isBlocking?: FilterModelBooleanType;
}

export enum GroupingEnum {
  assignee = 'assignee',
  label = 'label',
  status = 'status',
  priority = 'priority',
}

export enum OrderingEnum {
  assignee = 'assignee',
  priority = 'priority',
  status = 'status',
  updated_at = 'updated_at',
  created_at = 'created_at',
}

export enum ViewEnum {
  list = 'list',
  board = 'board',
}
