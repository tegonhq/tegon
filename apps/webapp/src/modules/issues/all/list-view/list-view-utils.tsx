import { IssueRelationEnum, type IssueType } from 'common/types';

import type { IssueRelationsStoreType } from 'store/issue-relation';
import type { IssuesStoreType } from 'store/issues';

const hasRelations = (
  issue: IssueType,
  issuesStore: IssuesStoreType,
  issueRelationsStore: IssueRelationsStoreType,
) => {
  const blockedIssues = issueRelationsStore.getIssueRelationForType(
    issue.id,
    IssueRelationEnum.BLOCKED,
  );
  if (blockedIssues.length > 0) {
    return true;
  }

  const blocksIssues = issueRelationsStore.getIssueRelationForType(
    issue.id,
    IssueRelationEnum.BLOCKS,
  );
  if (blocksIssues.length > 0) {
    return true;
  }

  const parentIssue = issuesStore.getIssueById(issue.parentId);
  if (parentIssue !== undefined) {
    return true;
  }

  const subIssues = issuesStore.getSubIssues(issue.id);
  return subIssues.length > 0;
};

type IssueRow =
  | { type: 'header'; key: string }
  | { type: 'issue'; issueId: string; hasRelations: boolean };

export const getIssueRows = (
  issues: IssueType[],
  property: string,
  keys: string[],
  showEmptyGroups: boolean,
  issuesStore: IssuesStoreType,
  issueRelationsStore: IssueRelationsStoreType,
  propertyArray: boolean = false,
): IssueRow[] => {
  // Use Map for better performance with string keys
  const groupedIssues = new Map<string, IssueType[]>();
  keys.forEach((key) => groupedIssues.set(key, []));
  const noValueRows: IssueType[] = [];

  // Group issues in a single pass
  issues.forEach((issue) => {
    if (!propertyArray) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const propertyValue = (issue as any)[property] as string;
      if (!propertyValue) {
        noValueRows.push(issue);
      } else {
        const propertyKey = keys.find((key: string) =>
          key.includes(propertyValue),
        );
        groupedIssues.get(propertyKey)?.push(issue);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const propertyValue = (issue as any)[property] as string[];
      if (propertyValue.length === 0) {
        noValueRows.push(issue);
      }

      if (propertyValue.length > 0) {
        propertyValue.forEach((value) => {
          groupedIssues.get(value)?.push(issue);
        });
      }
    }
  });

  // Pre-allocate result array with estimated size
  const estimatedSize = keys.length + issues.length;
  const result: IssueRow[] = Array(estimatedSize);
  let index = 0;

  // Build result array in a single pass
  keys.forEach((key) => {
    const groupIssues = groupedIssues.get(key) || [];

    // Skip empty groups if showEmptyGroups is false
    if (showEmptyGroups || groupIssues.length > 0) {
      result[index++] = { type: 'header', key };

      for (const issue of groupIssues) {
        result[index++] = {
          type: 'issue',
          issueId: issue.id,
          hasRelations: hasRelations(issue, issuesStore, issueRelationsStore),
        };
      }
    }
  });

  // Add no-value section if there are any issues without values
  if (noValueRows.length > 0) {
    result[index++] = { type: 'header', key: 'no-value' };

    for (const issue of noValueRows) {
      result[index++] = {
        type: 'issue',
        issueId: issue.id,
        hasRelations: hasRelations(issue, issuesStore, issueRelationsStore),
      };
    }
  }

  return result.slice(0, index);
};
