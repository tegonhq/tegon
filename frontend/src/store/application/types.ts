/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface UpdateBody {
  filters: Partial<FiltersModelType>;
}

export interface DisplaySettingsModelType {
  grouping: GroupingEnum;
  ordering: OrderingEnum;
  showSubIssues: boolean;
  showEmptyGroups: boolean;
  showTriageIssues: boolean;
  showCompletedIssues: boolean;
  sidebarCollapsed: boolean;
}

export interface UpdateDisplaySettingsBody
  extends Partial<DisplaySettingsModelType> {}

export enum FilterType {
  IS = 'IS',
  IS_NOT = 'IS_NOT',
  INCLUDES = 'INCLUDLES',
  INCLUDES_ANY = 'INCLUDES_ANY',
  EXCLUDES = 'EXCLUDES',
  EXCLUDES_ANY = 'EXCLUDES_ANY',
}

export interface FilterModelType {
  value: string[];
  filterType: FilterType;
}

export interface FiltersModelType {
  assignee?: FilterModelType;
  status?: FilterModelType;
  label?: FilterModelType;
  priority?: FilterModelType;
}

export enum GroupingEnum {
  assignee = 'assignee',
  label = 'label',
  status = 'status',
}

export enum OrderingEnum {
  assignee = 'assignee',
  priority = 'priority',
  status = 'status',
  updated_at = 'updated_at',
  created_at = 'created_at',
}
