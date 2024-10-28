import { RiBookmarkFill, RiBookmarkLine } from '@remixicon/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { DeleteLine, EditLine, MoreLine, StackLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { SidebarExpand } from 'common/sidebar-expand';
import type { ViewType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useUpdateViewMutation } from 'services/views';

import { DeleteViewAlert } from './delete-view-alert';
import { EditViewDialog } from './edit-view-dialog';

interface HeaderProps {
  title: string;
  view: ViewType;
}

export const Header = observer(({ title, view }: HeaderProps) => {
  const team = useCurrentTeam();

  const {
    query: { workspaceSlug },
  } = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const { mutate: updateView } = useUpdateViewMutation({});

  return (
    <header className="flex px-6  w-full items-center gap-2">
      <div className="flex py-3 items-center">
        <SidebarExpand />
        <Breadcrumb>
          {team && (
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                className="flex items-center gap-1 font-medium"
                href={`/${workspaceSlug}/team/${team.identifier}/views`}
              >
                <div className={`p-[2px] w-5 h-5 rounded-sm`}>
                  <StackLine size={16} />
                </div>
                <span className="inline-block">Views</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>
            <BreadcrumbLink>{title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center ml-1"
            >
              <MoreLine size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <div className="flex items-center gap-1">
                <EditLine size={16} /> Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteAlert(true)}>
              <div className="flex items-center gap-1">
                <DeleteLine size={16} /> Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center group"
          onClick={() => {
            updateView({
              viewId: view.id,
              filters: view.filters,
              isBookmarked: !view.isBookmarked,
            });
          }}
        >
          {view.isBookmarked ? (
            <RiBookmarkFill
              size={16}
              className="text-amber-600 hover:text-foreground group-hover:text-foreground"
            />
          ) : (
            <RiBookmarkLine size={16} />
          )}
        </Button>
      </div>

      <EditViewDialog view={view} open={editOpen} setOpen={setEditOpen} />
      <DeleteViewAlert
        viewId={view.id}
        open={deleteAlert}
        setOpen={setDeleteAlert}
      />
    </header>
  );
});
