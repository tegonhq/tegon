import type { IssueSuggestionType, IssueType } from 'common/types';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types';
import { sort } from 'fast-sort';
import React from 'react';

import { useContextStore } from 'store/global-context-provider';

import { useCurrentTeam } from './teams';
import { useTeamWorkflows } from './workflows';

export function useTriageGroups() {
  const currentTeam = useCurrentTeam();
  const { issuesStore, issueSuggestionsStore } = useContextStore();
  const workflows = useTeamWorkflows(currentTeam.identifier);
  const triageWorkflow = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.TRIAGE,
  );

  const issues = sort(
    issuesStore.getIssuesForState(triageWorkflow.id, currentTeam.id, false),
  ).desc((issue: IssueType) => new Date(issue.updatedAt)) as IssueType[];

  return React.useMemo(() => {
    const allIssueSuggestions: IssueSuggestionType[] = [];

    // Fetch issue suggestions for each issue ID
    for (const issue of issues) {
      const issueSuggestions =
        issueSuggestionsStore.getIssueSuggestionsForIssue(
          issue.id,
        ) as IssueSuggestionType;

      issueSuggestions && allIssueSuggestions.push({ ...issueSuggestions });
    }

    // Count occurrences of each label
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    const labelCounts: { [labelId: string]: number } = {};
    allIssueSuggestions.forEach((suggestion) => {
      suggestion.suggestedLabelIds.forEach((labelId) => {
        labelCounts[labelId] = (labelCounts[labelId] || 0) + 1;
      });
    });

    // Sort labels by their count in ascending order
    const sortedLabels = Object.keys(labelCounts).sort(
      (a, b) => labelCounts[b] - labelCounts[a],
    );

    const issueCategories: Record<string, IssueType[]> = {};
    const topLabels = sortedLabels.slice(0, 4);
    topLabels.forEach((label: string) => {
      issueCategories[label] = [];
    });

    // Last other category
    issueCategories['other'] = [];

    issues.forEach((issue: IssueType) => {
      const issueSuggestions =
        issueSuggestionsStore.getIssueSuggestionsForIssue(issue.id);
      const assignedCategory = topLabels.findIndex(
        (label) =>
          issueSuggestions &&
          issueSuggestions.suggestedLabelIds.includes(label),
      );

      switch (assignedCategory) {
        case 0:
          issueCategories[topLabels[0]].push(issue);
          break;
        case 1:
          issueCategories[topLabels[1]].push(issue);
          break;
        case 2:
          issueCategories[topLabels[2]].push(issue);
          break;
        case 3:
          issueCategories[topLabels[3]].push(issue);
          break;
        default:
          issueCategories.other.push(issue);
          break;
      }
    });

    return issueCategories;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues]);
}
