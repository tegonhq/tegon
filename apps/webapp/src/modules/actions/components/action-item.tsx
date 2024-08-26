// import { useParams } from 'next/navigation';

import type { ActionStatusEnum } from '@tegonhq/types';

import { cn } from '@tegonhq/ui/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import ReactTimeAgo from 'react-time-ago';

import { convertToTitleCase } from 'common/common-utils';
import { StatusMapping, type ActionType } from 'common/types';

interface ActionProps {
  action: ActionType;
  noBorder: boolean;
}

export function ActionItem({ action, noBorder }: ActionProps) {
  const { actionSlug } = useParams();

  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <Link href={`/${workspaceSlug}/actions/${action.slug}`}>
      <div
        key={action.id}
        className={cn(
          'ml-4 p-2 py-0 mr-4 hover:bg-grayAlpha-200 rounded',
          actionSlug === action.slug && 'bg-grayAlpha-200',
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-1 py-2',
            !noBorder && 'border-b border-border',
          )}
        >
          <div className="flex justify-between text-sm">
            <div className="w-[calc(100%_-_70px)]">
              <div className="truncate">{convertToTitleCase(action.name)}</div>
            </div>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <div className="flex items-center gap-1">
              {StatusMapping[action.status as ActionStatusEnum]}
            </div>

            <div className="text-muted-foreground text-xs">
              <ReactTimeAgo date={new Date(action.updatedAt)} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
