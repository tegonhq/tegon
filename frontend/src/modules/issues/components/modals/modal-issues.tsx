/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { CommandItem } from 'components/ui/command';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { ModalIssueItem } from './modal-issue-item';

interface ModalIssuesProps {
  value: string;
  onClose: () => void;
  type: IssueRelationEnum;
}

export const ModalIssues = observer(
  ({ value, onClose, type }: ModalIssuesProps) => {
    const {
      query: { issueId },
    } = useRouter();

    const issueNumber = (issueId as string).split('-')[1];
    const { issuesStore } = useContextStore();
    const { mutate: updateIssue } = useUpdateIssueMutation({});

    const issues = React.useMemo(() => {
      const issues = issuesStore.getIssues();

      if (value) {
        return issues
          .filter(
            (issue: IssueType) =>
              `${issue.number} ${issue.title}`
                .toLowerCase()
                .includes(value.toLowerCase()) &&
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

    const onSelect = (issueId: string) => {
      if (type === IssueRelationEnum.PARENT) {
        updateIssue({
          id: currentIssue.id,
          teamId: currentIssue.teamId,
          parentId: issueId,
        });
      }

      if (type === IssueRelationEnum.SUB_ISSUE) {
        const issueData = issuesStore.getIssueById(issueId);
        updateIssue({
          id: issueId,
          teamId: issueData.teamId,
          parentId: currentIssue.id,
        });
      }

      if (
        type === IssueRelationEnum.RELATED ||
        type === IssueRelationEnum.BLOCKS ||
        type === IssueRelationEnum.BLOCKED ||
        type === IssueRelationEnum.DUPLICATE ||
        type === IssueRelationEnum.DUPLICATE_OF
      ) {
        updateIssue({
          id: currentIssue.id,
          teamId: currentIssue.teamId,
          issueRelation: {
            type,
            issueId: currentIssue.id,
            relatedIssueId: issueId,
          },
        });
      }

      onClose();
    };

    return (
      <>
        {issues.map((issue: IssueType) => (
          <CommandItem
            key={issue.id}
            value={issue.id}
            className="m-2"
            onSelect={onSelect}
          >
            <ModalIssueItem issue={issue} />
          </CommandItem>
        ))}
      </>
    );
  },
);
