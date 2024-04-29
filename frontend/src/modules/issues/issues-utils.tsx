/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { sort } from 'fast-sort';
import { usePathname } from 'next/navigation';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import {
  FilterTypeEnum,
  OrderingEnum,
  type ApplicationStoreType,
  type DisplaySettingsModelType,
  type FilterModelBooleanType,
  type FilterModelType,
} from 'store/application';
import {
  useContextStore,
  type StoreContextInstanceType,
} from 'store/global-context-provider';

interface FilterNormalType extends FilterModelType {
  key: string;
}

interface FilterBooleanType extends FilterModelBooleanType {
  key: string;
}

type FilterType = FilterNormalType | FilterBooleanType;

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
      return fieldValue.includes(castedValue);
    case FilterTypeEnum.INCLUDES_ANY:
      return castedValue.some((value) => fieldValue.includes(value));
    case FilterTypeEnum.EXCLUDES:
      return !fieldValue.includes(castedValue);
    case FilterTypeEnum.EXCLUDES_ANY:
      return !castedValue.some((value) => fieldValue.includes(value));
    case FilterTypeEnum.UNDEFINED:
      return fieldValue === null || fieldValue === undefined;
    default:
      return true; // No filter, return all issues
  }
}

export function filterIssues(
  issues: IssueType[],
  filters: FilterType[],
<<<<<<< HEAD
  { issuesStore, issueRelationsStore }: Partial<StoreContextInstanceType>,
=======
  {
    linkedIssuesStore,
    issuesStore,
    issueRelationsStore,
  }: Partial<StoreContextInstanceType>,
>>>>>>> d60c4a4 (Feat: added views)
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
  applicationStore: ApplicationStoreType,
  workflows: WorkflowType[],
  pathname: string,
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

  if (pathname.includes('/backlog')) {
    const filteredWorkflow = workflows.filter(
      (workflow) => workflow.category === WorkflowCategoryEnum.BACKLOG,
    )[0];

    filters.push({
      key: 'stateId',
      filterType: FilterTypeEnum.IS,
      value: [filteredWorkflow.id],
    });
  }

  for (const filterKey of [
    'isParent',
    'isSubIssue',
    'isBlocked',
    'isBlocking',
    'source',
  ]) {
    if (applicationStore.filters[filterKey]) {
      filters.push({
        key: filterKey,
        filterType: FilterTypeEnum.IS,
      });
    }
  }

  return filters;
}

export function useFilterIssues(issues: IssueType[]): IssueType[] {
  const {
    applicationStore,
    workflowsStore,
    linkedIssuesStore,
    issuesStore,
    issueRelationsStore,
  } = useContextStore();
  const pathname = usePathname();

  return React.useMemo(() => {
    const filters = getFilters(
      applicationStore,
      workflowsStore.workflows,
      pathname,
    );
    const filteredIssues = filterIssues(issues, filters, {
      linkedIssuesStore,
      issuesStore,
      issueRelationsStore,
    });

    return sort(filteredIssues).by(
      getSortArray(applicationStore.displaySettings),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationStore.filters, applicationStore.displaySettings, issues]);
}
