import type React from 'react';

import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';

import {
  CycleDropdown,
  CycleDropdownVariant,
  DueDate,
} from 'modules/issues/components';

import { useIssueData } from 'hooks/issues';
import { useTeamWithId } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

export const EngineeringProperties = observer(() => {
  const issue = useIssueData();
  const team = useTeamWithId(issue?.teamId);

  const { teamsStore } = useContextStore();

  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const cyclesEnabledForTeam = teamsStore.cyclesEnabledForTeam(team.id);

  const dueDateChange = (dueDate: Date) => {
    updateIssue({
      id: issue.id,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      teamId: issue.teamId,
    });
  };

  const cycleChange = (cycleId: string) => {
    updateIssue({
      id: issue.id,
      cycleId,
      teamId: issue.teamId,
    });
  };

  return (
    <>
      <div className={cn('flex flex-col items-start')}>
        <div className="text-xs text-left">Due Date</div>
        <DueDate dueDate={issue.dueDate} dueDateChange={dueDateChange} />
      </div>
      {cyclesEnabledForTeam && (
        <div className={cn('flex flex-col items-start')}>
          <div className="text-xs text-left">Cycle</div>

          <CycleDropdown
            value={issue.cycleId}
            onChange={cycleChange}
            variant={CycleDropdownVariant.LINK}
            teamIdentifier={team.identifier}
          />
        </div>
      )}
    </>
  );
});
