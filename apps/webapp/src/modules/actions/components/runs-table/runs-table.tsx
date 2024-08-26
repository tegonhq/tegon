import type { ActionType } from 'common/types';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useGetRunsForActionQuery, type TriggerRun } from 'services/action';

import { columns } from './columns';
import { DataTable } from './data-table';

interface RunsTable {
  action: ActionType;
}

export function RunsTable({ action }: RunsTable) {
  const workspace = useCurrentWorkspace();
  const { isLoading, data: runsData } = useGetRunsForActionQuery(
    action.slug,
    workspace.id,
  );

  if (isLoading) {
    return null;
  }

  const runs =
    runsData?.data.map((run: TriggerRun) => ({ ...run, action })) ?? [];

  return <DataTable columns={columns} data={runs} />;
}
