import { Loader } from '@tegonhq/ui/components/loader';
import { useParams } from 'next/navigation';

import { useContextStore } from 'store/global-context-provider';

import { LeftSide } from './single-action/left-side';
import { RightSide } from './single-action/right-side';

export function SingleAction() {
  return (
    <div className="flex flex-col h-[100vh]">
      <main className="grid grid-cols-5 h-[calc(100vh_-_53px)] bg-background-2 rounded-tl-3xl">
        <div className="col-span-5 xl:col-span-4 flex flex-col h-[calc(100vh_-_55px)] shrink-1">
          <LeftSide />
        </div>
        <div className="border-l border-border hidden flex-col xl:flex shrink-0">
          <RightSide />
        </div>
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
