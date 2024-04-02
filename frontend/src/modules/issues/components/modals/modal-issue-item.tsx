/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import { type IssueType } from 'common/types/issue';

import { useTeamWithId } from 'hooks/teams';
import { useAllTeamWorkflows } from 'hooks/workflows';

interface ModalIssueItemProps {
  issue: IssueType;
}

export const ModalIssueItem = observer(({ issue }: ModalIssueItemProps) => {
  const team = useTeamWithId(issue.teamId);
  const workflows = useAllTeamWorkflows(team.identifier);
  const workflow = workflows.find((workflow) => workflow.id === issue.stateId);

  const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

  return (
    <div className="cursor-pointer flex items-center rounded-md">
      <CategoryIcon
        size={16}
        className="text-muted-foreground mr-3"
        color={workflow.color}
      />
      <div className="text-sm text-foreground mr-3 min-w-[50px]">{`${team.identifier}-${issue.number}`}</div>
      <div className="text-sm text-muted-foreground max-w-[300px]">
        <div className="truncate"> {issue.title}</div>
      </div>
    </div>
  );
});
