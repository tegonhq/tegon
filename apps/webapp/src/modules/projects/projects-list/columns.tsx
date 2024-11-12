'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Project } from '@tegonhq/ui/icons';
import * as React from 'react';

import type { ProjectType } from 'common/types';

import { useUpdateProjectMutation } from 'services/projects';

import { ProjectWrapper } from './project-wrapper';
import { ProjectDatePicker } from '../dropdowns/project-date-picker';
import { ProjectStatusDropdown } from '../dropdowns/status';
import { ProjectProgress } from '../project-view/project-progress';

export const useProjectColumns = (): Array<ColumnDef<ProjectType>> => {
  const { mutate: updateProject } = useUpdateProjectMutation({});

  const onStatusUpdate = (status: string, projectId: string) => {
    updateProject({
      status,
      projectId,
    });
  };

  const onEndDateUpdate = (endDate: string, projectId: string) => {
    updateProject({
      endDate,
      projectId,
    });
  };

  return [
    {
      accessorKey: 'title',
      header: () => {
        return <span className="px-4">Title</span>;
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize pl-4 py-2 flex items-center gap-1">
            <Project />
            {row.original.name}
          </div>
        );
      },
    },
    {
      accessorKey: 'progress',
      header: () => {
        return <span className="px-2">Progress</span>;
      },
      cell: ({ row }) => <ProjectProgress id={row.original.id} onlyGraph />,
    },
    {
      accessorKey: 'endDate',
      header: () => {
        return <span className="px-2">Target date</span>;
      },
      cell: ({ row }) => (
        <ProjectWrapper
          id={row.original.id}
          Component={ProjectDatePicker}
          value="endDate"
          onChange={(date: string) => onEndDateUpdate(date, row.original.id)}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: () => {
        return <span className="px-2">Status</span>;
      },

      cell: ({ row }) => {
        return (
          <ProjectWrapper
            id={row.original.id}
            Component={ProjectStatusDropdown}
            value="status"
            onChange={(status: string) =>
              onStatusUpdate(status, row.original.id)
            }
          />
        );
      },
    },
  ];
};
