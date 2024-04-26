/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiDeleteBin7Line,
  RiMoreFill,
  RiPencilFill,
  RiStarFill,
  RiStarLine,
} from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import type { ViewType } from 'common/types/view';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { useCurrentTeam } from 'hooks/teams';
import { SidebarLine, StackLine } from 'icons';

import { useUpdateViewMutation } from 'services/views';

import { useContextStore } from 'store/global-context-provider';

import { DeleteViewAlert } from './delete-view-alert';
import { EditViewDialog } from './edit-view-dialog';

interface HeaderProps {
  title: string;
  view: ViewType;
}

export const Header = observer(({ title, view }: HeaderProps) => {
  const team = useCurrentTeam();
  const { applicationStore } = useContextStore();
  const {
    query: { workspaceSlug },
  } = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const { mutate: updateView } = useUpdateViewMutation({});

  return (
    <header className="flex justify-between pl-8 px-4 py-2 w-full border-b items-center gap-2">
      <div className="flex items-center">
        {applicationStore.sidebarCollapsed && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              applicationStore.updateSideBar(false);
            }}
          >
            <SidebarLine size={16} />
          </Button>
        )}
        <Breadcrumb className="text-xs">
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
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground">
              {title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex items-center">
            <Button
              variant="ghost"
              size="xs"
              className="flex items-center ml-1"
            >
              <RiMoreFill
                className="text-slate-500 hover:text-black dark:hover:text-white"
                size={16}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <div className="flex items-center gap-2 text-xs">
                <RiPencilFill size={14} /> Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteAlert(true)}>
              <div className="flex items-center gap-2 text-xs">
                <RiDeleteBin7Line size={14} /> Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="xs"
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
            <RiStarFill
              size={16}
              className="text-yellow-500 hover:text-foreground group-hover:text-foreground"
            />
          ) : (
            <RiStarLine size={16} />
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
