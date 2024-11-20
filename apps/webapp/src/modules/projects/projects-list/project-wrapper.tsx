/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';

import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

interface ProjectWrapperProps {
  id: string;
  value: string;
  onChange: (value: any) => void;
  Component: any;
}

export const ProjectWrapper = observer(
  ({ id, value, onChange, Component }: ProjectWrapperProps) => {
    const { projectsStore } = useContextStore();
    const project = projectsStore.getProjectWithId(id);

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Component value={project[value]} onChange={onChange} />
      </div>
    );
  },
);
