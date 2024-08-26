import type { ColumnDef } from '@tanstack/react-table';
import type { ActionStatusEnum } from '@tegonhq/types';
import { differenceInSeconds } from 'date-fns';

export interface ActionType {
  id: string;
  status: ActionStatusEnum;
  time: string;
  createdAt: string;
  updatedAt: string;
}

function getSecondsBetweenDates(createdAt: string, finishedAt: string): number {
  // Parse the date strings into Date objects
  const createdDate = new Date(createdAt);
  const finishedDate = new Date(finishedAt);

  // Ensure that the parsed dates are valid
  if (isNaN(createdDate.getTime()) || isNaN(finishedDate.getTime())) {
    throw new Error('Invalid date strings');
  }

  // Calculate the difference in seconds between the two dates
  const seconds = differenceInSeconds(finishedDate, createdDate);

  return seconds;
}

export const columns: Array<ColumnDef<ActionType>> = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      return (
        <div>
          {getSecondsBetweenDates(
            row.original.createdAt,
            row.original.updatedAt,
          )}
          s
        </div>
      );
    },
  },
];
