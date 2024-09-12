import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@tegonhq/ui/components/button';
import {
  CheckCircle,
  ChevronRight,
  CrossCircle,
  Loader,
} from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { format } from 'date-fns';
import { differenceInSeconds } from 'date-fns';

import { capitalizeFirstLetter } from 'common/lib/common';

import type { TriggerRun } from 'services/action';

import { RunOptionsDropdown } from './run-options-dropdown';

const statusIconMapping = {
  // Loading states
  WAITING_FOR_DEPLOY: 'loading',
  QUEUED: 'loading',
  EXECUTING: 'loading',
  REATTEMPTING: 'loading',
  FROZEN: 'loading',

  // Success states
  COMPLETED: 'success',

  // Error states
  CANCELED: 'error',
  FAILED: 'error',
  CRASHED: 'error',
  INTERRUPTED: 'error',
  SYSTEM_FAILURE: 'error',
};

type StatusIconMappingType = keyof typeof statusIconMapping;
type Status = 'loading' | 'error' | 'success';

function getIcon(status: Status) {
  switch (status) {
    case 'loading':
      return <Loader className="animate-spin" />;

    case 'error':
      return <CrossCircle className="text-destructive" />;

    case 'success':
      return <CheckCircle className="text-success" />;

    default:
      return <CrossCircle className="text-destructive" />;
  }
}

function getSecondsBetweenDates(createdAt: string, finishedAt: string): string {
  // Parse the date strings into Date objects
  const createdDate = new Date(createdAt);
  const finishedDate = new Date(finishedAt);

  // Ensure that the parsed dates are valid
  if (isNaN(createdDate.getTime()) || isNaN(finishedDate.getTime())) {
    return 'recent';
  }

  // Calculate the difference in seconds between the two dates
  const seconds = differenceInSeconds(finishedDate, createdDate);

  return `${seconds}s`;
}

export const columns: Array<ColumnDef<TriggerRun>> = [
  {
    id: 'action',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div>
          <Button onClick={() => row.toggleExpanded()} variant="link">
            <ChevronRight
              className={cn(
                'transition-transform duration-200',
                row.getIsExpanded() && 'rotate-90',
              )}
            />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const Icon = getIcon(
        statusIconMapping[
          row.original.status as StatusIconMappingType
        ] as Status,
      );

      return (
        <div className="capitalize flex gap-1 items-center">
          {Icon}
          {capitalizeFirstLetter(row.original.status)}
        </div>
      );
    },
  },
  {
    accessorKey: 'time',
    header: 'Ttl',
    cell: ({ row }) => {
      return (
        <div>
          {getSecondsBetweenDates(
            row.original.startedAt ?? row.original.createdAt,
            row.original.finishedAt,
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const startedAt = row.original.startedAt ?? row.original.createdAt;
      return <div>{format(new Date(startedAt), 'MMM dd HH:mm bb')}</div>;
    },
  },
  {
    id: 'options',
    enableHiding: false,
    cell: ({ row }) => {
      return <RunOptionsDropdown run={row.original} />;
    },
  },
];
