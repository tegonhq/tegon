import { CommandItem } from '@tegonhq/ui/components/command';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueRelationEnum } from 'common/types';
import type { IssueType } from 'common/types';

import { useIssueData } from 'hooks/issues';

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
    const issue = useIssueData();

    const { issuesStore } = useContextStore();
    const { mutate: updateIssue } = useUpdateIssueMutation({});

    const issues = React.useMemo(() => {
      const issues = issuesStore.getIssues({});

      if (value) {
        return issues
          .filter(
            (is: IssueType) =>
              `${is.number} ${is.title}`
                .toLowerCase()
                .includes(value.toLowerCase()) && is.id !== issue.id,
          )
          .slice(0, 10);
      }

      return issues.filter((is: IssueType) => is.id !== issue.id).slice(0, 5);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const onSelect = (relatedIssueId: string) => {
      if (type === IssueRelationEnum.PARENT) {
        const issueData = issuesStore.getIssueById(relatedIssueId);

        updateIssue({
          id: issueData.id,
          teamId: issueData.teamId,
          parentId: issue.id,
        });
      }

      if (type === IssueRelationEnum.SUB_ISSUE) {
        updateIssue({
          id: issue.id,
          teamId: issue.teamId,
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
          id: issue.id,
          teamId: issue.teamId,
          issueRelation: {
            type,
            issueId: issue.id,
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
