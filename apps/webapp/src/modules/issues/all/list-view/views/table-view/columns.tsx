'use client';

import type { Row } from '@tanstack/react-table';
import type { UseMutateFunction } from 'react-query';

import Link from 'next/link';
import React from 'react';

import {
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';
import { IssueLabels } from 'modules/issues/components/issue-list-item/issue-labels';

import type { IssueType } from 'common/types';

import { type UpdateIssueParams } from 'services/issues';

import type { TeamsStoreType } from 'store/teams';

interface RowType {
  row: Row<IssueType>;
}

export const getColumns = (
  workspaceSlug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateIssue: UseMutateFunction<unknown, any, UpdateIssueParams, void>,
  teamsStore: TeamsStoreType,
) => {
  const statusChange = (issue: IssueType, stateId: string) => {
    updateIssue({ id: issue.id, stateId, teamId: issue.teamId });
  };

  const assigneeChange = (issue: IssueType, assigneeId: string) => {
    updateIssue({ id: issue.id, assigneeId, teamId: issue.teamId });
  };

  const priorityChange = (issue: IssueType, priority: number) => {
    updateIssue({ id: issue.id, priority, teamId: issue.teamId });
  };

  return [
    {
      accessorKey: 'title',
      header: () => <span>Issue</span>,

      cell: ({ row }: RowType) => {
        const team = teamsStore.getTeamWithId(row.original.teamId);

        return (
          <Link
            href={`/${workspaceSlug}/issue/${team.identifier}-${row.original.number}`}
            className="flex flex-wrap shrink w-full gap-2 justify-between pr-4"
          >
            <span className="flex items-center justify-start shrink min-w-[0px]">
              <div className="min-w-[70px] text-muted-foreground text-xs font-mono">{`${team.identifier}-${row.original.number}`}</div>

              <span className="text-left"> {row.original.title}</span>
            </span>
          </Link>
        );
      },
    },
    {
      accessorKey: 'assignee',
      header: () => <span>Assignee</span>,
      cell: ({ row }: RowType) => {
        return (
          <div>
            <IssueAssigneeDropdown
              value={row.original.assigneeId}
              onChange={(assigneeId: string) =>
                assigneeChange(row.original, assigneeId)
              }
              teamId={row.original.teamId}
              variant={IssueAssigneeDropdownVariant.LINK}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: () => <span>Status</span>,
      cell: ({ row }: RowType) => {
        const team = teamsStore.getTeamWithId(row.original.teamId);
        return (
          <div>
            <IssueStatusDropdown
              value={row.original.stateId}
              onChange={(stateId: string) => {
                statusChange(row.original, stateId);
              }}
              variant={IssueStatusDropdownVariant.LINK}
              teamIdentifier={team.identifier}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: () => <span>Priority</span>,
      cell: ({ row }: RowType) => {
        return (
          <div>
            <IssuePriorityDropdown
              value={row.original.priority ?? 0}
              onChange={(priority: number) => {
                priorityChange(row.original, priority);
              }}
              variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
              className="text-xs"
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'labels',
      header: () => <span>Labels</span>,
      cell: ({ row }: RowType) => {
        return (
          <div>
            <IssueLabels labelIds={row.original.labelIds} />
          </div>
        );
      },
    },
  ];
};
