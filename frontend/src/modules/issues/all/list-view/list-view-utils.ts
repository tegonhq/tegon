/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { sort } from 'fast-sort';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import {
  FilterTypeEnum,
  OrderingEnum,
  type ApplicationStoreType,
  type DisplaySettingsModelType,
  type FilterModelType,
} from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface FilterType extends FilterModelType {
  key: string;
}

export function filterIssue(issue: IssueType, filter: FilterType) {
  // TODO: Fix the type later
  const { key, value, filterType } = filter;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldValue = (issue as any)[key];

  switch (filterType) {
    case FilterTypeEnum.IS:
      return value.includes(fieldValue);
    case FilterTypeEnum.IS_NOT:
      return !value.includes(fieldValue);
    case FilterTypeEnum.INCLUDES:
      return fieldValue.includes(value);
    case FilterTypeEnum.INCLUDES_ANY:
      return value.some((value) => fieldValue.includes(value));
    case FilterTypeEnum.EXCLUDES:
      return !fieldValue.includes(value);
    case FilterTypeEnum.EXCLUDES_ANY:
      return !value.some((value) => fieldValue.includes(value));
    case FilterTypeEnum.UNDEFINED:
      return fieldValue === null || fieldValue === undefined;
    default:
      return true; // No filter, return all issues
  }
}

export function filterIssues(issues: IssueType[], filters: FilterType[]) {
  return issues.filter((issue: IssueType) => {
    return filters.every((filter) => filterIssue(issue, filter));
  });
}

export function getSortArray(displaySettings: DisplaySettingsModelType) {
  const by = [];

  switch (displaySettings.ordering) {
    case OrderingEnum.assignee: {
      by.push({ asc: (issue: IssueType) => issue.assigneeId });
      break;
    }

    case OrderingEnum.updated_at: {
      by.push({ desc: (issue: IssueType) => issue.updatedAt });
      break;
    }

    case OrderingEnum.created_at: {
      by.push({ desc: (issue: IssueType) => issue.createdAt });
      break;
    }

    case OrderingEnum.priority: {
      by.push({ asc: (issue: IssueType) => issue.priority });
      break;
    }

    case OrderingEnum.status: {
      by.push({ asc: (issue: IssueType) => issue.stateId });
      break;
    }
  }

  return by;
}

export function getFilters(
  applicationStore: ApplicationStoreType,
  workflows: WorkflowType[],
) {
  const { status, assignee, label, priority } = applicationStore.filters;
  const { showSubIssues, showCompletedIssues, showTriageIssues } =
    applicationStore.displaySettings;

  const filters: FilterType[] = [];

  if (status) {
    filters.push({
      key: 'stateId',
      filterType: status.filterType,
      value: status.value,
    });
  }

  if (assignee) {
    filters.push({
      key: 'assigneeId',
      filterType: assignee.filterType,
      value: assignee.value,
    });
  }

  if (label) {
    filters.push({
      key: 'labelIds',
      filterType: label.filterType,
      value: label.value,
    });
  }

  if (priority) {
    filters.push({
      key: 'priority',
      filterType: priority.filterType,
      value: priority.value,
    });
  }

  if (!showSubIssues) {
    filters.push({
      key: 'parentId',
      filterType: FilterTypeEnum.UNDEFINED,
      value: undefined,
    });
  }

  if (!showCompletedIssues) {
    const filteredWorkflows = workflows.filter(
      (workflow) =>
        workflow.category === WorkflowCategoryEnum.COMPLETED ||
        workflow.category === WorkflowCategoryEnum.CANCELED,
    );

    filters.push({
      key: 'stateId',
      filterType: FilterTypeEnum.IS_NOT,
      value: filteredWorkflows.map((workflow) => workflow.id),
    });
  }

  if (!showTriageIssues) {
    const filteredWorkflows = workflows.filter(
      (workflow) => workflow.category === WorkflowCategoryEnum.TRIAGE,
    );

    filters.push({
      key: 'stateId',
      filterType: FilterTypeEnum.IS_NOT,
      value: filteredWorkflows.map((workflow) => workflow.id),
    });
  }

  return filters;
}

export function useFilterIssues(issues: IssueType[]): IssueType[] {
  const { applicationStore, workflowsStore } = useContextStore();

  return React.useMemo(() => {
    const filters = getFilters(applicationStore, workflowsStore.workflows);
    const filteredIssues = filterIssues(issues, filters);

    return sort(filteredIssues).by(
      getSortArray(applicationStore.displaySettings),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applicationStore.filters.status,
    applicationStore.filters.assignee,
    applicationStore.filters.label,
    applicationStore.filters.priority,
    applicationStore.displaySettings.ordering,
    applicationStore.displaySettings.showSubIssues,
    applicationStore.displaySettings.showEmptyGroups,
    applicationStore.displaySettings.showCompletedIssues,
    applicationStore.displaySettings.showTriageIssues,
    issues,
  ]);
}
