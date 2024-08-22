import { Actions } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

export const Empty = observer(() => {
  const { actionsStore } = useContextStore();
  const actions = actionsStore.actions;

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-2">
      <div className="p-2 border border-border rounded">
        <Actions size={32} />
      </div>

      <div>
        {actions.length === 0
          ? 'No actions found. Install a action'
          : `${actions.length} actions installed`}
      </div>
    </div>
  );
});
