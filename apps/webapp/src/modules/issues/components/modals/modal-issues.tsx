import { CommandItem } from '@tegonhq/ui/components/command';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { useCurrentTeam } from 'hooks/teams';

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
          .slice(0, 10);
      }

      return issues
        .filter((issue: IssueType) => issue.number !== parseInt(issueNumber))
        .slice(0, 5);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    const team = useCurrentTeam();
    const currentIssue = issuesStore.getIssueByNumber(issueId, team.id);

    const onSelect = (relatedIssueId: string) => {
      if (type === IssueRelationEnum.PARENT) {
        const issueData = issuesStore.getIssueById(relatedIssueId);

        updateIssue({
          id: issueData.id,
          teamId: issueData.teamId,
          parentId: currentIssue.id,
        });
      }

      if (type === IssueRelationEnum.SUB_ISSUE) {
        updateIssue({
          id: currentIssue.id,
          teamId: currentIssue.teamId,
          parentId: relatedIssueId,
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
            relatedIssueId,
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
            className="mx-2 my-2 !py-2"
            onSelect={onSelect}
          >
            <ModalIssueItem issue={issue} />
          </CommandItem>
        ))}
      </>
    );
  },
);
