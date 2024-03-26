/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiSearch2Line } from '@remixicon/react';
import * as React from 'react';

import { NewIssueLine } from 'icons';

import { NewIssueDialog } from 'modules/issues/new-issue/new-issue-dialog';

import { cn } from 'common/lib/utils';

import { Button } from 'components/ui/button';
import { Dialog, DialogTrigger } from 'components/ui/dialog';

import { WorkspaceDropdown } from './workspace-dropdown';

export function Header() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="flex flex-col m-3 text-slate-700 dark:text-slate-300">
      <div className="flex justify-between items-center">
        <WorkspaceDropdown />
      </div>

      <div className={cn('flex mt-4 gap-2')}>
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn('flex-grow justify-start')}
            >
              <NewIssueLine size={16} className="text-muted-foreground" />
              <div className="ml-3 text-sm"> New Issue </div>
            </Button>
          </DialogTrigger>
          <NewIssueDialog onClose={() => setDialogOpen(false)} />
        </Dialog>
        <Button variant="outline" size="sm">
          <RiSearch2Line size={16} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
