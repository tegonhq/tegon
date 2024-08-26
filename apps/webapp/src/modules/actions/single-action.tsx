import { Button } from '@tegonhq/ui/components/button';
import { Loader } from '@tegonhq/ui/components/loader';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { useParams } from 'next/navigation';

import { convertToTitleCase } from 'common';

import { useGetExternalActionDataQuery } from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { RunsTable } from './components/runs-table';

export function SingleAction() {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);
  const { isLoading: loading, data: latestAction } =
    useGetExternalActionDataQuery(actionSlug as string);

  if (loading) {
    return null;
  }
  return (
    <div className="flex flex-col h-[100vh]">
      <main className=" h-[calc(100vh_-_53px)] bg-background-2 rounded-tl-3xl">
        <ScrollArea className="grow flex flex-col p-6 h-full gap-2">
          <h2 className="text-xl">{convertToTitleCase(action.name)}</h2>
          <p className=" text-muted-foreground">{latestAction?.description}</p>
          <div className="mt-6 flex justify-between flex-wrap items-center">
            <div className="flex flex-col">
              <div className="text-md">All runs</div>
              <p className="text-muted-foreground"> last 25 runs</p>
            </div>
            <div>
              <Button variant="secondary" size="lg">
                Create test run
              </Button>
            </div>
          </div>
          <RunsTable action={action} />
        </ScrollArea>
      </main>
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
