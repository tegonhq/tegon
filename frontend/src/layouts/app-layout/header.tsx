/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiEditBoxLine, RiSearch2Line } from '@remixicon/react';
import { cn } from 'lib/utils';

import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

import { ProfileDropdown } from './profile-dropdown';
import { WorkspaceDropdown } from './workspace-dropdown';

interface HeaderProps {
  isCollapsed: boolean;
}

export function Header({ isCollapsed }: HeaderProps) {
  return (
    <div className="flex flex-col m-2 text-gray-700 dark:text-gray-300">
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
