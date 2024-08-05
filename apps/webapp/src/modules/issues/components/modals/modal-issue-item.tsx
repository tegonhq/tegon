import { type IssueType } from 'common/types';
import { observer } from 'mobx-react-lite';

import { getWorkflowColor } from 'common/status-color';
import { WORKFLOW_CATEGORY_ICONS } from 'common/workflow-icons';

import { useTeamWithId } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

interface ModalIssueItemProps {
  issue: IssueType;
}

export const ModalIssueItem = observer(({ issue }: ModalIssueItemProps) => {
  const team = useTeamWithId(issue.teamId);
  const workflows = useTeamWorkflows(team.identifier);
  const workflow = workflows.find((workflow) => workflow.id === issue.stateId);

  const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

  return (
    <div className="cursor-pointer flex items-center rounded-md">
      <CategoryIcon
        size={20}
        className="mr-3"
        color={getWorkflowColor(workflow).color}
      />
      <div className="mr-3 font-mono min-w-[50px]">{`${team.identifier}-${issue.number}`}</div>
      <div className="max-w-[500px]">
        <div className="truncate"> {issue.title}</div>
      </div>
    </div>
  );
});
