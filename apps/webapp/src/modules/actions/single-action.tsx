import { ActionStatusEnum } from '@tegonhq/types';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { Loader } from '@tegonhq/ui/components/loader';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import { Warning } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { convertToTitleCase } from 'common';

import { useGetExternalActionDataQuery } from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { RunsTable } from './components/runs-table';

export function SingleAction() {
  const { actionSlug, workspaceSlug } = useParams();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);
  const { isLoading: loading, data: latestAction } =
    useGetExternalActionDataQuery(actionSlug as string);

  if (loading) {
    return null;
  }
  return (
    <div className="flex flex-col h-[100vh]">
      <ScrollArea className="grow flex flex-col p-6 h-full gap-2">
        <div className="flex gap-1 justify-between">
          <div className="flex gap-1">
            <h2 className="text-xl">{convertToTitleCase(action.name)}</h2>
            {action.status === ActionStatusEnum.NEEDS_CONFIGURATION && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    className={cn(buttonVariants({ variant: 'link' }))}
                    href={`/${workspaceSlug}/settings/actions/${actionSlug}`}
                  >
                    <Warning size={20} className="text-warning" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  This action is not configured. You can configure in settings.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <Link
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
            href={`/${workspaceSlug}/settings/actions/${actionSlug}`}
          >
            Edit configuration
          </Link>
        </div>
        <p className=" text-muted-foreground">{latestAction?.description}</p>

        <div className="mt-6 flex justify-between flex-wrap items-center">
          <div className="flex flex-col">
            <div className="text-md">All runs</div>
            <p className="text-muted-foreground"> last 25 runs</p>
          </div>
        </div>
        <RunsTable action={action} />
      </ScrollArea>
    </div>
  );
}

export function SingleActionWrapper() {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);

  if (!action) {
    return <Loader text="No action found" />;
  }

  return <SingleAction />;
}
