import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tegonhq/ui/components/table';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import { useContextStore } from 'store/global-context-provider';

import { useProjectColumns } from './columns';

export const ProjectsList = observer(() => {
  const { projectsStore } = useContextStore();
  const [data, setData] = React.useState(projectsStore.getProjects);
  const router = useRouter();

  React.useEffect(() => {
    setData(projectsStore.getProjects.toJSON());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsStore.getProjects.length]);

  const columns = useProjectColumns();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const goToProject = (projectId: string) => {
    router.push(`/${router.query.workspaceSlug}/projects/${projectId}`);
  };

  return (
    <div className="flex items-center w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-sm">
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
                className="cursor-pointer"
                onClick={() => {
                  goToProject(row.original.id);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="w-[90%] py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              ></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
