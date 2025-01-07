import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { DeleteLine, MoreLine } from '@tegonhq/ui/icons';
import React from 'react';

import { useRemoveTeamMemberMutation } from 'services/team';

interface MemberOptionsDropdownProps {
  userId: string;
  role?: string;
}

export function WorkspaceOptionsDropdown({
  userId,
  role
}: MemberOptionsDropdownProps) {
  const { toast } = useToast();
  const { mutate: removeMember } = useRemoveTeamMemberMutation({
    onError: (err: string) => {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: err,
      });
    },
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="link"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <MoreLine size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
           {role !== 'admin' &&<DropdownMenuItem
              // onClick={() => {
              //   removeMember({
              //     userId,
              //   });
              // }}
            >
              <div className="flex items-center gap-1">
                 Make this user as Admin
              </div>
            </DropdownMenuItem>}
            <DropdownMenuItem
              // onClick={() => {
              //   removeMember({
              //     userId,
              //   });
              // }}
            >
              <div className="flex items-center gap-1">
                <DeleteLine size={16} /> Remove from team
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
