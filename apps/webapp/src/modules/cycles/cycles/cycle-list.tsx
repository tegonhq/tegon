import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';

import type { CycleType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { CycleListItem } from './cycle-list-item';

export const CycleList = observer(() => {
  const { cyclesStore } = useContextStore();
  const team = useCurrentTeam();

  const cycles = cyclesStore.getCyclesForTeam(team.id);
  console.log(cycles);

  return (
    <ScrollArea className="h-full w-full" id="cycles-list">
      <div className="flex flex-col gap-4 h-full pb-[100px] p-3 pt-0 pl-0">
        {cycles.map((cycle: CycleType, index: number) => (
          <CycleListItem cycle={cycle} key={index} />
        ))}
      </div>
    </ScrollArea>
  );
});
