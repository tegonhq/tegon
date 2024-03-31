/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import type { IssueRelationEnum } from 'common/types/issue-relation';

import { useContextStore } from 'store/global-context-provider';

import { ModalIssueItem } from './modal-issue-item';

interface ModalIssuesProps {
  value: string;
  onClose: () => void;
  type: IssueRelationEnum;
}

export function ModalIssues({ value, onClose, type }: ModalIssuesProps) {
  const {
    query: { issueId },
  } = useRouter();
  const issueNumber = (issueId as string).split('-')[1];
  const { issuesStore } = useContextStore();

  const issues = React.useMemo(() => {
    const issues = issuesStore.getIssues();

    if (value) {
      return issues
        .filter(
          (issue: IssueType) =>
            issue.title.toLowerCase().includes(value.toLowerCase()) &&
            issue.number !== parseInt(issueNumber),
        )
        .slice(0, 5);
    }

    return issues
      .filter((issue: IssueType) => issue.number !== parseInt(issueNumber))
      .slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const currentIssue = issuesStore.getIssueByNumber(issueId);

  return (
    <div className="p-3">
      {issues.map((issue: IssueType) => (
        <ModalIssueItem
          issue={issue}
          key={issue.id}
          onClose={onClose}
          currentIssue={currentIssue}
          type={type}
        />
      ))}
    </div>
  );
}
