import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button } from '@tegonhq/ui/components/button';
import { AddLine, DocumentLine, IssuesLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React from 'react';

import { HeaderLayout } from 'common/header-layout';

import { useProject } from 'hooks/projects';

import { ProjectDetailsDropdown } from './dropdowns/project-details-dropdown';
import { NewProjectDialog } from './new-project-dialog';

interface HeaderProps {
  title: string;
  isProjectView?: boolean;
  view?: string;
  setView?: (view: 'overview' | 'issues') => void;
  href?: string;
}

export const Header = observer(
  ({ title, isProjectView, view, setView, href }: HeaderProps) => {
    const [newProjectDialog, setNewProjectDialog] = React.useState(false);
    const project = useProject();

    const actions = (
      <>
        {!isProjectView && (
          <div>
            <Button
              variant="secondary"
              className="gap-1"
              size="sm"
              onClick={() => setNewProjectDialog(true)}
            >
              <AddLine size={14} />
              Create project
            </Button>
          </div>
        )}
      </>
    );

    return (
      <HeaderLayout actions={actions}>
        <Breadcrumb>
          <BreadcrumbItem>
            {href ? (
              <Link href={href}>
                <BreadcrumbLink>{title}</BreadcrumbLink>
              </Link>
            ) : (
              <BreadcrumbLink>{title}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {isProjectView && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink>{project?.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <ProjectDetailsDropdown />
            </>
          )}
        </Breadcrumb>

        {isProjectView && (
          <div className="flex items-center ml-2 gap-1">
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

        {newProjectDialog && (
          <NewProjectDialog
            open={newProjectDialog}
            setOpen={setNewProjectDialog}
          />
        )}
      </HeaderLayout>
    );
  },
);
