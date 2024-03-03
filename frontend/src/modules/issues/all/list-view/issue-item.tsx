/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { WORKFLOW_CATEGORY_ICONS } from 'modules/settings/team/workflow/workflow-item';

import { useCurrentTeam } from 'common/hooks/use-current-team';
import { useTeamWorkflows } from 'common/hooks/use-team-workflows';
import { IssueType } from 'common/types/issue';

interface IssueItemProps {
  issue: IssueType;
}

export function IssueItem({ issue }: IssueItemProps) {
  const team = useCurrentTeam();
  const workflows = useTeamWorkflows();
  const currentWorkflow = workflows.find(
    (workflow) => workflow.id === issue.stateId,
  );
  const CategoryIcon =
    WORKFLOW_CATEGORY_ICONS[currentWorkflow.name] ??
    WORKFLOW_CATEGORY_ICONS['Backlog'];

  return (
    <div className="pl-9 p-3 flex justify-between text-sm hover:bg-slate-100/50 dark:hover:bg-slate-900/50 border-b-[0.5px]">
      <div className="flex items-center">
        <div className="pr-3 text-muted-foreground min-w-[60px]">{`${team.identifier}-${issue.number}`}</div>
        <div className="pr-3">
          <CategoryIcon
            size={18}
            className="text-muted-foreground"
            color={currentWorkflow.color}
          />
        </div>
        <div className="font-medium">{issue.title}</div>
      </div>
      <div></div>
    </div>
  );
}
