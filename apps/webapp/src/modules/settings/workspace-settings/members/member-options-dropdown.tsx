import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { CanceledLine, DeleteLine, MoreLine } from '@tegonhq/ui/icons';
import React from 'react';

import { useRemoveTeamMemberMutation } from 'services/team';
import { useSuspendUserMutation } from 'services/workspace';

interface MemberOptionsDropdownProps {
  userId: string;
  teamId: string;
  isAdmin: boolean;
  isSuspended: boolean;
}

export function MemberOptionsDropdown({
  userId,
  teamId,
  isAdmin,
  isSuspended,
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

  const { mutate: suspendUser } = useSuspendUserMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User has been suspended',
      });
    },
  });

  if (!isAdmin || isSuspended) {
    return null;
  }

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
            {isAdmin && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    suspendUser({
                      userId,
                    });
                  }}
                >
                  <div className="flex items-center gap-1">
                    <CanceledLine size={16} /> Suspend
                  </div>
                </DropdownMenuItem>
              </>
            )}
            {teamId && isAdmin && (
              <DropdownMenuItem
                onClick={() => {
                  removeMember({
                    userId,
                    teamId,
                  });
                }}
              >
                <div className="flex items-center gap-1">
                  <DeleteLine size={16} /> Remove from team
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
