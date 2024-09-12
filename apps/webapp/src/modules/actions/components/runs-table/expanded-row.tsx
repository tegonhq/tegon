import type { Row } from '@tanstack/react-table';

import { Loader } from '@tegonhq/ui/components/loader';
import { TableCell } from '@tegonhq/ui/components/table';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useGetRunForActionQuery, type TriggerRun } from 'services/action';

interface ExpandedRowProps {
  row: Row<TriggerRun>;
}

export function ExpandedRow({ row }: ExpandedRowProps) {
  const workspace = useCurrentWorkspace();

  const action = row.original.action;
  const { data: run, isLoading } = useGetRunForActionQuery(
    action.slug,
    row.original.id,
    workspace.id,
  );

  return (
    <TableCell colSpan={5}>
      <div className="w-full">
        {isLoading ? (
          <Loader text="Loading logs..." />
        ) : (
          <div>
            <div className="flex gap-4 mb-2 px-[0.3rem] py-[0.2rem]">
              <div className="flex flex-col min-w-24">
                <div>Event</div>
                <div className="font-mono font-medium">{run.payload.event}</div>
              </div>

              <div className="flex flex-col min-w-24">
                <div>Type</div>
                <div className="font-mono font-medium">{run.payload.type}</div>
              </div>
            </div>

            {run.logs.split('\n').map((log: string, index: number) => (
              <div key={index}>
                <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold text-[#BF4594]">
                  {log}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>
    </TableCell>
  );
}
