/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import { type IssueType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { useUpdateIssueMutation } from 'services/issues';

interface ModalIssueItemProps {
  issue: IssueType;
  currentIssue: IssueType;
  onClose: () => void;
  type: IssueRelationEnum;
}

export const ModalIssueItem = observer(
  ({ issue, onClose, currentIssue, type }: ModalIssueItemProps) => {
    const currentTeam = useCurrentTeam();
    const workflows = useTeamWorkflows(currentTeam.identifier);
    const workflow = workflows.find(
      (workflow) => workflow.id === issue.stateId,
    );
    const { mutate: updateIssue } = useUpdateIssueMutation({});

    const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

    const onClick = () => {
      if (type === IssueRelationEnum.PARENT) {
        updateIssue({
          id: currentIssue.id,
          teamId: currentTeam.id,
          parentId: issue.id,
        });
      }

      if (type === IssueRelationEnum.SUB_ISSUE) {
        updateIssue({
          id: issue.id,
          teamId: currentTeam.id,
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
          teamId: currentTeam.id,
          issueRelation: {
            type,
            issueId: currentIssue.id,
            relatedIssueId: issue.id,
          },
        });
      }

      onClose();
    };

    return (
      <div
        className="p-3 cursor-pointer flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md mb-1"
        onClick={onClick}
      >
        <CategoryIcon
          size={18}
          className="text-muted-foreground mr-3"
          color={workflow.color}
        />
        <div className="text-sm text-foreground mr-3">{`${currentTeam.identifier}-${issue.number}`}</div>
        <div className="text-sm text-muted-foreground">{issue.title}</div>
      </div>
    );
  },
);
