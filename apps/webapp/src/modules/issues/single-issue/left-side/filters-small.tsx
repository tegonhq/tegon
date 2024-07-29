import { useUpdateIssueMutation } from '@tegonhq/services/issues';
import { observer } from 'mobx-react-lite';

import {
  IssueAssigneeDropdown,
  IssueLabelDropdown,
  IssuePriorityDropdown,
  IssueStatusDropdown,
} from 'modules/issues/components';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

export const FilterSmall = observer(() => {
  const issue = useIssueData();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const currentTeam = useCurrentTeam();

  const statusChange = (stateId: string) => {
    updateIssue({ id: issue.id, stateId, teamId: issue.teamId });
  };

  const assigneeChange = (assigneeId: string) => {
    updateIssue({ id: issue.id, assigneeId, teamId: issue.teamId });
  };

  const labelsChange = (labelIds: string[]) => {
    updateIssue({ id: issue.id, labelIds, teamId: issue.teamId });
  };

  const priorityChange = (priority: number) => {
    updateIssue({
      id: issue.id,
      priority,
      teamId: issue.teamId,
    });
  };

  return (
    <div className="my-1 flex gap-2">
      <IssueStatusDropdown
        value={issue.stateId}
        onChange={statusChange}
        teamIdentifier={currentTeam.identifier}
      />

      <IssuePriorityDropdown
        value={issue.priority ?? 0}
        onChange={priorityChange}
      />

      <IssueAssigneeDropdown
        value={issue.assigneeId}
        onChange={assigneeChange}
      />

      <IssueLabelDropdown
        value={issue.labelIds}
        onChange={labelsChange}
        teamIdentifier={currentTeam.identifier}
      />
    </div>
  );
});
