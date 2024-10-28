import { observer } from 'mobx-react-lite';
import React from 'react';

import { ProjectDatePicker } from 'modules/projects/dropdowns/project-date-picker';
import {
  ProjectDropdownVariant,
  ProjectStatusDropdown,
} from 'modules/projects/dropdowns/status';
import { TeamsDropdown } from 'modules/projects/dropdowns/teams';

import { useProject } from 'hooks/projects';

export const RightSide = observer(() => {
  const project = useProject();

  return (
    <>
      <div className="grow p-6 flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <label className="text-xs">Status</label>
          <ProjectStatusDropdown
            value={project.status}
            variant={ProjectDropdownVariant.LINK}
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs">Start Date</label>

          <ProjectDatePicker
            value={project.startDate}
            variant={ProjectDropdownVariant.LINK}
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs">End Date</label>

          <ProjectDatePicker
            value={project.endDate}
            variant={ProjectDropdownVariant.LINK}
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs">Teams</label>

          <TeamsDropdown
            value={project.teams}
            variant={ProjectDropdownVariant.LINK}
          />
        </div>
      </div>
    </>
  );
});
