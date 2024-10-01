import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnSizingState,
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
import { useParams } from 'next/navigation';
import React from 'react';

import type { IssueType } from 'common/types';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { ColumnResizer } from './column-resizer';
import { getColumns } from './columns';

interface TableCProps {
  issues: IssueType[];
}

export const TableC = observer(({ issues }: TableCProps) => {
  const { teamsStore } = useContextStore();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [colSizing, setColSizing] = React.useState<ColumnSizingState>({});

  const { mutate: updateIssue } = useUpdateIssueMutation({});

  const columns = getColumns(workspaceSlug, updateIssue, teamsStore);

  const table = useReactTable({
    data: issues,
    columns,
    enableColumnResizing: true,
    onColumnSizingChange: setColSizing,
    state: {
      columnSizing: colSizing,
    },
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  return (
    <div className="mx-6 h-full overflow-y-auto">
      <div className="h-full relative overflow-auto">
        <Table style={{ width: table.getTotalSize() }}>
          <TableHeader className="sticky top-0 bg-background-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="relative"
                      style={{
                        minWidth:
                          header.id === 'title' ? 400 : header.getSize(),
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      <ColumnResizer header={header} />
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
                    <TableCell
                      key={cell.id}
                      className="bg-background-2 hover:bg-grayAlpha-100"
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
