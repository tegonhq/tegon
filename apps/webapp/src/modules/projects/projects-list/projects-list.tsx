import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tegonhq/ui/components/table';
import { BookMark } from '@tegonhq/ui/icons';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import type { ViewType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';
import { useUserData } from 'hooks/users';

import { useUpdateViewMutation } from 'services/views';

import { useContextStore } from 'store/global-context-provider';

import { columns } from './columns';

interface ViewItemProps {
  view: ViewType;
}

export function ViewItem({ view }: ViewItemProps) {
  const { teamIdentifier, workspaceSlug } = useParams();
  const { user } = useUserData(view.createdById);
  const { mutate: updateView } = useUpdateViewMutation({});

  return (
    <Link
      href={
        teamIdentifier
          ? `/${workspaceSlug}/team/${teamIdentifier}/views/${view.id}`
          : `/${workspaceSlug}/views/${view.id}`
      }
      className="flex gap-2 text-foreground items-center pl-8 pr-4 py-2 border-b border-border"
    >
      <div className="min-w-[200px] grow flex flex-col">
        <div className="font-medium flex items-center min-h-[25px]">
          <div>{view.name}</div>

          <Button
            variant="ghost"
            size="sm"
            className={'flex items-center'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              updateView({
                viewId: view.id,
                filters: view.filters,
                isBookmarked: !view.isBookmarked,
              });
            }}
          >
            {view.isBookmarked ? (
              <BookMark size={14} className="text-amber-600" />
            ) : (
              <BookMark size={14} />
            )}
          </Button>
        </div>
        {view.description && (
          <div className="text-muted-foreground">{view.description}</div>
        )}
      </div>
      <div className="min-w-[70px]">
        {dayjs(view.createdAt).format('DD MMM')}
      </div>
      {user && (
        <div className="min-w-[70px] flex gap-2">
          <AvatarText text={user?.fullname} className="w-5 h-5 text-[9px]" />

          {user?.fullname}
        </div>
      )}
    </Link>
  );
}

export const ProjectsList = observer(() => {
  const { projectsStore } = useContextStore();

  const table = useReactTable({
    data: projectsStore.projects,
    columns,

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex items-center w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-6 text-sm">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Button variant="secondary">Create new project</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
