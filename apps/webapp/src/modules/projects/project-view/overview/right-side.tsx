import { Button } from '@tegonhq/ui/components/button';
import { Separator } from '@tegonhq/ui/components/separator';
import { AddLine } from '@tegonhq/ui/icons';
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

export const RightSide = observer(() => {
  const project = useProject();
  const { mutate: updateProject } = useUpdateProjectMutation({});

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
    updateProject({
      teams,
      projectId: project.id,
    });
  };

  return (
    <>
      <div className="grow py-6 flex flex-col gap-4">
        <h3 className="px-6"> Project details </h3>

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

        <div className="flex justify-between px-6 items-center">
          <h3> Milestones</h3>
          <Button variant="ghost" size="sm">
            <AddLine size={14} />
          </Button>
        </div>
      </div>
    </>
  );
});
