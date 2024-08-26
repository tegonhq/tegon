import type { ActionType } from 'common/types';

import { useGetRunsForActionQuery } from 'services/action';

import { columns } from './columns';
import { DataTable } from './data-table';

interface RunsTable {
  action: ActionType;
}

export function RunsTable({ action }: RunsTable) {
  const { isLoading, data: runsData } = useGetRunsForActionQuery(action.slug);

  if (isLoading) {
    return null;
  }

  const runs = runsData?.data ?? [];

  return (
    <div>
      <DataTable columns={columns} data={runs} />
    </div>
  );
}
