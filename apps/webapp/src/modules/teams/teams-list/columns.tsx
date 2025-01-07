'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { CheckLine, Project } from '@tegonhq/ui/icons';
import * as React from 'react';
import { useToast } from '@tegonhq/ui/components/use-toast';
import type { TeamType } from 'common/types';
import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';
import { useAddTeamMemberMutation } from 'services/team';
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
  const teamAccessList = workspaceStore.getUserData(currentUser.id)?.teamIds ?? [];
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
        return <span className="px-4 whitespace-nowrap">Membership Status</span>;
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize pl-4 py-2 flex items-center gap-1">
            {teamAccessList.includes(row.original.id) ? 
            <div className='flex-row flex items-center gap-1 bg-grayAlpha-100 rounded-sm px-2 py-1 cursor-default'><CheckLine size={16} /> Joined 
            </div> : 
            <div onClick={()=>addTeamMember({
              userId: currentUser.id,
              teamId: row.original.id,
            })} className='bg-grayAlpha-100 rounded-sm px-2 py-1 cursor-pointer'>Join team
            </div>
            }
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
            <TeamOptionsDropdown teamAccessList={teamAccessList} team={row.original} />
          </div>
        );
      },
    },
   
  ];
};
