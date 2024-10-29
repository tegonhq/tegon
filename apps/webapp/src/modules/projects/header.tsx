import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button } from '@tegonhq/ui/components/button';
import { AddLine, DocumentLine, IssuesLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { SidebarExpand } from 'common/sidebar-expand';

import { useProject } from 'hooks/projects';

import { NewProjectDialog } from './new-project-dialog';

interface HeaderProps {
  title: string;
  isProjectView?: boolean;
  view?: string;
  setView: (view: string) => void;
}

export const Header = observer(
  ({ title, isProjectView, view, setView }: HeaderProps) => {
    const [newProjectDialog, setNewProjectDialog] = React.useState(false);
    const project = useProject();

    return (
      <header className="flex px-6 w-full items-center gap-2">
        <div className="flex gap-2 py-3 items-center w-full">
          <div className="flex grow justify-start items-center">
            <SidebarExpand />
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink>{title}</BreadcrumbLink>
              </BreadcrumbItem>
              {isProjectView && (
                <BreadcrumbItem>
                  <BreadcrumbLink>{project.name}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </Breadcrumb>
            {isProjectView && (
              <div className="flex items-center ml-4 gap-1">
                <Button
                  variant="secondary"
                  className="gap-1"
                  isActive={view === 'overview'}
                  onClick={() => setView('overview')}
                >
                  <DocumentLine />
                  Overview
                </Button>
                <Button
                  variant="secondary"
                  className="gap-1"
                  isActive={view === 'issues'}
                  onClick={() => setView('issues')}
                >
                  <IssuesLine />
                  Issues
                </Button>
              </div>
            )}
          </div>

          {!isProjectView && (
            <div>
              <Button
                variant="secondary"
                className="gap-1"
                onClick={() => setNewProjectDialog(true)}
              >
                <AddLine size={14} />
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
  },
);
