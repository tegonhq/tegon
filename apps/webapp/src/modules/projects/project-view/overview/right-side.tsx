import { Separator } from '@tegonhq/ui/components/separator';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { ProjectDatePicker } from 'modules/projects/dropdowns/project-date-picker';
import {
  ProjectDropdownVariant,
  ProjectStatusDropdown,
} from 'modules/projects/dropdowns/status';
import { TeamsDropdown } from 'modules/projects/dropdowns/teams';

import { useProject } from 'hooks/projects';

import { useUpdateProjectMutation } from 'services/projects';

import { Milestones } from './milestones';

export const RightSide = observer(() => {
  const project = useProject();
  const { mutate: updateProject } = useUpdateProjectMutation({});
  const { toast } = useToast();

  const onStatusUpdate = (status: string) => {
    updateProject({
      status,
      projectId: project.id,
    });
  };

  const onEndDateUpdate = (endDate: string) => {
    updateProject({
      endDate,
      projectId: project.id,
    });
  };

  const onStartDateUpdate = (startDate: string) => {
    updateProject({
      startDate,
      projectId: project.id,
    });
  };

  const onTeamChange = (teams: string[]) => {
    if (teams.length === 0) {
      toast({
        title: 'Error!',
        description: 'Atleast one team should be there',
      });
      return;
    }

    updateProject({
      teams,
      projectId: project.id,
    });
  };

  return (
    <>
      <div className="grow py-4 flex flex-col gap-4">
        <div className="flex flex-col items-start px-6">
          <label className="text-xs">Status</label>
          <ProjectStatusDropdown
            value={project.status}
            variant={ProjectDropdownVariant.LINK}
            onChange={onStatusUpdate}
          />
        </div>

        <div className="flex flex-col items-start px-6">
          <label className="text-xs">Start Date</label>

          <ProjectDatePicker
            value={project.startDate}
            variant={ProjectDropdownVariant.LINK}
            onChange={onStartDateUpdate}
          />
        </div>

        <div className="flex flex-col items-start px-6">
          <label className="text-xs">End Date</label>

          <ProjectDatePicker
            value={project.endDate}
            variant={ProjectDropdownVariant.LINK}
            onChange={onEndDateUpdate}
          />
        </div>

        <div className="flex flex-col items-start px-6">
          <label className="text-xs">Teams</label>

          <TeamsDropdown
            value={project.teams}
            onChange={onTeamChange}
            variant={ProjectDropdownVariant.LINK}
          />
        </div>

        <Separator className="mt-4 mb-2" />

        <Milestones />
      </div>
    </>
  );
});
