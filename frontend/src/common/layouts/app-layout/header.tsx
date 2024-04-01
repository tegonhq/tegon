/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiSearch2Line } from '@remixicon/react';
import * as React from 'react';

import { NewIssueDialog } from 'modules/issues/new-issue/new-issue-dialog';
import { SearchDialog } from 'modules/search';

import { cn } from 'common/lib/utils';

import { Button } from 'components/ui/button';
import { NewIssueLine } from 'icons';

import { WorkspaceDropdown } from './workspace-dropdown';

export function Header() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchDialog, setSearchDialog] = React.useState(false);

  return (
    <div className="flex flex-col m-3 my-2 text-slate-700 dark:text-slate-300">
      <div className="flex justify-between items-center">
        <WorkspaceDropdown />
      </div>

      <div className={cn('flex mt-4 gap-2')}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className={cn('flex-grow justify-start')}
        >
          <NewIssueLine size={16} className="text-muted-foreground" />
          <div className="ml-3 text-sm"> New Issue </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchDialog(true)}
        >
          <RiSearch2Line size={16} className="text-muted-foreground" />
        </Button>
      </div>

      <NewIssueDialog open={dialogOpen} setOpen={setDialogOpen} />
      <SearchDialog open={searchDialog} setOpen={setSearchDialog} />
    </div>
  );
}
