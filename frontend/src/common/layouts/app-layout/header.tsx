/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiEditBoxLine, RiSearch2Line } from '@remixicon/react';

import { NewIssueDialog } from 'modules/issues/new-issue/new-issue-dialog';

import { cn } from 'common/lib/utils';

import { Button } from 'components/ui/button';
import { Dialog, DialogTrigger } from 'components/ui/dialog';
import { Separator } from 'components/ui/separator';

import { ProfileDropdown } from './profile-dropdown';
import { WorkspaceDropdown } from './workspace-dropdown';

interface HeaderProps {
  isCollapsed: boolean;
}

export function Header({ isCollapsed }: HeaderProps) {
  return (
    <div className="flex flex-col m-2 text-slate-700 dark:text-slate-300">
      <div
        className={cn(
          'flex justify-between items-center',
          isCollapsed && 'flex-col',
        )}
      >
        <WorkspaceDropdown isCollapsed={isCollapsed} />
        <ProfileDropdown />
      </div>
      {isCollapsed && <Separator className="mt-2" />}
      <div className={cn('flex mt-4 gap-2', isCollapsed && 'flex-col')}>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'flex-grow justify-start',
                isCollapsed && 'justify-center px-0',
              )}
            >
              <RiEditBoxLine size={16} className="text-muted-foreground" />
              {!isCollapsed && <div className="ml-3 text-sm"> New Issue </div>}
            </Button>
          </DialogTrigger>
          <NewIssueDialog />
        </Dialog>
        <Button
          variant="outline"
          size="sm"
          className={cn(isCollapsed && 'px-0')}
        >
          <RiSearch2Line size={16} className="text-muted-foreground" />
        </Button>
      </div>
      {isCollapsed && <Separator className="mt-4" />}
    </div>
  );
}
