import { Badge } from '@tegonhq/ui/components/badge';
import { Cycle } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

interface IssueCycleProps {
  cycleId: string;
}

export const IssueCycle = observer(({ cycleId }: IssueCycleProps) => {
  const { cyclesStore } = useContextStore();

  if (!cycleId) {
    return null;
  }

  const cycle = cyclesStore.getCycleForId(cycleId);

  if (!cycle) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 flex-wrap">
      <Badge
        variant="secondary"
        key={cycle.name}
        className="flex items-center gap-1 shrink min-w-[0px]"
      >
        <Cycle size={14} className="shrink-0" />
        <div className="truncate"> {cycle.name}</div>
      </Badge>
    </div>
  );
});
