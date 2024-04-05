/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { sort } from 'fast-sort';
import React from 'react';

import type { IssueType } from 'common/types/issue';

import {
  FilterType,
  OrderingEnum,
  type DisplaySettingsModelType,
} from 'store/application';
import { useContextStore } from 'store/global-context-provider';

export function filterIssue(
  issue: IssueType,
  key: string,
  filterType: FilterType,
  filterValues: string[],
) {
  // TODO: Fix the type later
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldValue = (issue as any)[key];

  switch (filterType) {
    case FilterType.IS:
      return filterValues.includes(fieldValue);
    case FilterType.IS_NOT:
      return !filterValues.includes(fieldValue);
    case FilterType.INCLUDES:
      return fieldValue.includes(filterValues);
    case FilterType.INCLUDES_ANY:
      return filterValues.some((value) => fieldValue.includes(value));
    case FilterType.EXCLUDES:
      return !fieldValue.includes(filterValues);
    case FilterType.EXCLUDES_ANY:
      return !filterValues.some((value) => fieldValue.includes(value));
    default:
      return true; // No filter, return all issues
  }
}

export function getSortArray(displaySettings: DisplaySettingsModelType) {
  const by = [];

  switch (displaySettings.ordering) {
    case OrderingEnum.assignee: {
      by.push({ asc: (issue: IssueType) => issue.assigneeId });
      break;
    }

    case OrderingEnum.updated_at: {
      by.push({ asc: (issue: IssueType) => issue.updatedAt });
      break;
    }

    case OrderingEnum.created_at: {
      by.push({ asc: (issue: IssueType) => issue.createdAt });
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

export function useFilterIssues(issues: IssueType[]): IssueType[] {
  const { applicationStore } = useContextStore();
  const { status, assignee, label, priority } = applicationStore.filters;

  return React.useMemo(() => {
    const filteredIssues = issues.filter((issue: IssueType) => {
      if (status) {
        return filterIssue(issue, 'stateId', status.filterType, status.value);
      }

      if (assignee) {
        return filterIssue(
          issue,
          'assigneeId',
          status.filterType,
          status.value,
        );
      }

      if (label) {
        return filterIssue(issue, 'labelIds', status.filterType, status.value);
      }

      if (priority) {
        return filterIssue(issue, 'priority', status.filterType, status.value);
      }

      return true;
    });

    return sort(filteredIssues).by(
      getSortArray(applicationStore.displaySettings),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    assignee,
    label,
    priority,
    applicationStore.displaySettings.ordering,
  ]);
}
