import { WorkflowCategoryEnum } from '@tegonhq/types';
import { sort } from 'fast-sort';
import { usePathname } from 'next/navigation';
import React from 'react';

import { type WorkflowType } from 'common/types';
import type { IssueType, LabelType } from 'common/types';

import { useComputedLabels } from 'hooks/labels';

import {
  TimeBasedFilterEnum,
  FilterTypeEnum,
  OrderingEnum,
  type DisplaySettingsModelType,
  type FilterModelBooleanType,
  type FilterModelType,
  type FilterModelTimeBasedType,
  type FiltersModelType,
} from 'store/application';
import {
  useContextStore,
  type StoreContextInstanceType,
} from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

interface FilterNormalType extends FilterModelType {
  key: string;
}

interface FilterBooleanType extends FilterModelBooleanType {
  key: string;
}

interface FilterTimeBasedType extends FilterModelTimeBasedType {
  key: string;
}

type FilterType = FilterNormalType | FilterBooleanType | FilterTimeBasedType;

export function filterIssue(issue: IssueType, filter: FilterType) {
  // TODO: Fix the type later
  const { key, value, filterType } = filter as FilterNormalType;
  const castedValue = value as string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldValue = (issue as any)[key];

  switch (filterType) {
    case FilterTypeEnum.IS:
      return castedValue.includes(fieldValue);
    case FilterTypeEnum.IS_NOT:
      return !castedValue.includes(fieldValue);
    case FilterTypeEnum.INCLUDES:
      return castedValue.some((value) => fieldValue.includes(value));
    case FilterTypeEnum.EXCLUDES:
      return !castedValue.some((value) => fieldValue.includes(value));
    case FilterTypeEnum.UNDEFINED:
      return fieldValue === null || fieldValue === undefined;
    default:
      return true; // No filter, return all issues
  }
}

export function filterTimeBasedIssue(issue: IssueType, filter: FilterType) {
  // TODO: Fix the type later
  const { key, filterType } = filter as FilterTimeBasedType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldValue = (issue as any)[key];

  // Handle time-based filters
  if (Object.values(TimeBasedFilterEnum).includes(filterType)) {
    const now = new Date().getTime();

    switch (filterType) {
      case TimeBasedFilterEnum.PastDay:
        return new Date(fieldValue).getTime() >= now - 24 * 60 * 60 * 1000; // Last 24 hours
      case TimeBasedFilterEnum.PastWeek:
        return new Date(fieldValue).getTime() >= now - 7 * 24 * 60 * 60 * 1000; // Last 7 days
    }
  }

  return true;
}

export function filterIssues(
  issues: IssueType[],
  filters: FilterType[],
  { issuesStore, issueRelationsStore }: Partial<StoreContextInstanceType>,
  isCompleted: (stateId: string) => boolean,
) {
  return issues.filter((issue: IssueType) => {
    return filters.every((filter) => {
      switch (filter.key) {
        case 'isParent': {
          return issuesStore.isSubIssue(issue.id);
        }

        case 'isSubIssue': {
          return filter.filterType === FilterTypeEnum.IS
            ? !!issue.parentId
            : !issue.parentId;
        }

        case 'isBlocked': {
          return issueRelationsStore.isBlocked(issue.id);
        }

        case 'isBlocking': {
          return issueRelationsStore.isBlocking(issue.id);
        }

        case 'updatedAt': {
          return filterTimeBasedIssue(issue, filter);
        }

        case 'completed_updatedAt': {
          if (!isCompleted(issue.stateId)) {
            return true;
          }

          return (
            isCompleted(issue.stateId) &&
            filterTimeBasedIssue(issue, { ...filter, key: 'updatedAt' })
          );
        }

        default:
          return filterIssue(issue, filter);
      }
    });
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
  filters: FiltersModelType = {},
  displaySettings: DisplaySettingsModelType,
  workflows: WorkflowType[],
  labels: LabelType[],
  userId?: string,
) {
  const { status, assignee, label, priority, project } = filters;
  const { showSubIssues, completedFilter, showTriageIssues } = displaySettings;

  const finalFilters: FilterType[] = [];

  if (status) {
    const ids = status.value.flatMap(
      (value: string) =>
        workflows.find((workflow) => workflow.name === value)?.ids || [],
    );

    finalFilters.push({
      key: 'stateId',
      filterType: status.filterType,
      value: ids,
    });
  }

  if (assignee) {
    if (assignee.value.includes('no-user')) {
      finalFilters.push({
        key: 'assigneeId',
        filterType: FilterTypeEnum.UNDEFINED,
      });
    }

    const restAssigneeValues = assignee.value.filter(
      (a: string) => a !== 'no-user',
    );

    if (restAssigneeValues.length > 0) {
      finalFilters.push({
        key: 'assigneeId',
        filterType: assignee.filterType,
        value: restAssigneeValues,
      });
    }
  }

  if (!assignee && userId) {
    finalFilters.push({
      key: 'assigneeId',
      filterType: FilterTypeEnum.IS,
      value: [userId],
    });
  }

  if (label) {
    const ids = label.value.flatMap(
      (value: string) =>
        labels.find((label) => label.name === value)?.ids || [],
    );

    finalFilters.push({
      key: 'labelIds',
      filterType: label.filterType,
      value: ids,
    });
  }

  if (priority) {
    finalFilters.push({
      key: 'priority',
      filterType: priority.filterType,
      value: priority.value,
    });
  }

  if (project) {
    finalFilters.push({
      key: 'projectId',
      filterType: project.filterType,
      value: project.value,
    });
  }

  if (!showSubIssues) {
    finalFilters.push({
      key: 'parentId',
      filterType: FilterTypeEnum.UNDEFINED,
      value: undefined,
    });
  }

  if (
    completedFilter &&
    (completedFilter === TimeBasedFilterEnum.PastDay ||
      completedFilter === TimeBasedFilterEnum.PastWeek)
  ) {
    finalFilters.push({
      key: 'completed_updatedAt',
      filterType: completedFilter,
    });
  }

  if (completedFilter && completedFilter === TimeBasedFilterEnum.None) {
    const filteredWorkflows = workflows.filter(
      (workflow) =>
        workflow.category === WorkflowCategoryEnum.COMPLETED ||
        workflow.category === WorkflowCategoryEnum.CANCELED,
    );

    finalFilters.push({
      key: 'stateId',
      filterType: FilterTypeEnum.IS_NOT,
      value: filteredWorkflows.flatMap((workflow: WorkflowType) =>
        workflow.ids ? workflow.ids : workflow.id,
      ),
    });
  }

  if (!showTriageIssues) {
    const filteredWorkflows = workflows.filter(
      (workflow) => workflow.category === WorkflowCategoryEnum.TRIAGE,
    );

    finalFilters.push({
      key: 'stateId',
      filterType: FilterTypeEnum.IS_NOT,
      value: filteredWorkflows.flatMap((workflow: WorkflowType) =>
        workflow.ids ? workflow.ids : workflow.id,
      ),
    });
  }

  for (const filterKey of [
    'isParent',
    'isSubIssue',
    'isBlocked',
    'isBlocking',
    'source',
  ]) {
    if (filters[filterKey as keyof FiltersModelType]) {
      finalFilters.push({
        key: filterKey,
        filterType: FilterTypeEnum.IS,
      });
    }
  }

  return finalFilters;
}

export function useFilterIssues(
  issues: IssueType[],
  workflows: WorkflowType[],
  filterSilent: boolean = true,
): IssueType[] {
  const pathname = usePathname();
  const user = React.useContext(UserContext);

  const {
    applicationStore,
    linkedIssuesStore,
    issuesStore,
    issueRelationsStore,
  } = useContextStore();
  const { labels } = useComputedLabels();

  const isCompleted = (stateId: string) => {
    const filteredWorkflows = workflows.filter(
      (workflow: WorkflowType) =>
        workflow.category === WorkflowCategoryEnum.COMPLETED ||
        workflow.category === WorkflowCategoryEnum.CANCELED,
    );

    return !!filteredWorkflows.find(
      (workflow: WorkflowType) => workflow.id === stateId,
    );
  };

  return React.useMemo(() => {
    const filters = getFilters(
      applicationStore.filters,
      applicationStore.displaySettings,
      workflows,
      labels,
      pathname.includes('my-issues') ? user.id : undefined,
    );

    const silentFilters = filterSilent
      ? getFilters(
          applicationStore.silentFilters,
          applicationStore.displaySettings,
          workflows,
          labels,
          pathname.includes('my-issues') ? user.id : undefined,
        )
      : [];

    const filteredIssues = filterIssues(
      issues,
      [...filters, ...silentFilters],
      {
        linkedIssuesStore,
        issuesStore,
        issueRelationsStore,
      },
      isCompleted,
    );

    return sort(filteredIssues).by(
      getSortArray(applicationStore.displaySettings),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationStore.filters, applicationStore.displaySettings, issues]);
}
