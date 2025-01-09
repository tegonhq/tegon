'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@tegonhq/ui/components/badge';
import { Button } from '@tegonhq/ui/components/button';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { CheckLine } from '@tegonhq/ui/icons';
import * as React from 'react';

import type { TeamType } from 'common/types';

import { useAddTeamMemberMutation } from 'services/team';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

import { TeamOptionsDropdown } from './teamsOptionsDropdown';

export const useProjectColumns = (): Array<ColumnDef<TeamType>> => {
  const { workspaceStore } = useContextStore();
  const { toast } = useToast();
  const currentUser = React.useContext(UserContext);

  const { mutate: addTeamMember } = useAddTeamMemberMutation({
    onSuccess: () => {
      toast({
        title: 'Team',
        description: 'Joined team successfully',
      });
    },
  });
  const teamAccessList =
    workspaceStore.getUserData(currentUser.id)?.teamIds ?? [];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
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
            <TeamIcon name={row.original.name} />
            {row.original.name}
          </div>
        );
      },
    },
    {
      accessorKey: 'Team Identifier',
      header: () => {
        return <span className="px-4 whitespace-nowrap">Team Identifier</span>;
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize pl-4 py-2 flex items-center gap-1">
            {row.original.identifier}
          </div>
        );
      },
    },
    {
      accessorKey: 'Membership Status',
      header: () => {
        return (
          <span className="px-4 whitespace-nowrap">Membership Status</span>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize pl-4 py-2 flex items-center gap-1">
            {teamAccessList.includes(row.original.id) ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckLine size={14} /> Joined
              </Badge>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  addTeamMember({
                    userId: currentUser.id,
                    teamId: row.original.id,
                  })
                }
              >
                Join team
              </Button>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: 'Created At',
      header: () => {
        return <span className="px-4 whitespace-nowrap">Created At</span>;
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize pl-4 py-2 flex items-center gap-1">
            {formatDate(row.original.createdAt)}
          </div>
        );
      },
    },
    {
      accessorKey: 'Created At',
      header: () => {
        return <span className="px-4 whitespace-nowrap"></span>;
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize pl-4 py-2 flex items-center gap-1">
            <TeamOptionsDropdown
              teamAccessList={teamAccessList}
              team={row.original}
            />
          </div>
        );
      },
    },
  ];
};
