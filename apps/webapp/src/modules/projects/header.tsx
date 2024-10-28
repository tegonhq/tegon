import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { SidebarExpand } from 'common/sidebar-expand';

import { NewProjectDialog } from './new-project-dialog';

interface HeaderProps {
  title: string;
  isProjectView?: boolean;
}

export const Header = observer(({ title, isProjectView }: HeaderProps) => {
  const [newProjectDialog, setNewProjectDialog] = React.useState(false);

  return (
    <header className="flex px-6 w-full items-center gap-2">
      <div className="flex gap-2 py-3 items-center w-full">
        <div className="flex grow justify-start items-center">
          <SidebarExpand />
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink>{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          {isProjectView && (
            <div className="flex items-center ml-2 gap-1">
              <Button variant="secondary" isActive>
                Overview
              </Button>
              <Button variant="secondary"> Issues</Button>
            </div>
          )}
        </div>

        {!isProjectView && (
          <div>
            <Button
              variant="secondary"
              onClick={() => setNewProjectDialog(true)}
            >
              Create project
            </Button>
          </div>
        )}
      </div>

      {newProjectDialog && (
        <NewProjectDialog
          open={newProjectDialog}
          setOpen={setNewProjectDialog}
        />
      )}
    </header>
  );
});
