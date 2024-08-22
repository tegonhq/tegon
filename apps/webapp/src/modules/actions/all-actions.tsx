import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

import type { ActionType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { Action } from './components/action';

export const AllActions = observer(() => {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();
  const actions = actionsStore.actions;

  return (
    <div className="flex flex-col gap-1">
      {actions.map((action: ActionType, index: number) => {
        const active = actionSlug === action.slug;
        const nextActive = actions[index + 1]
          ? actions[index + 1].name === actionSlug
          : false;

        return (
          <Action
            action={action}
            key={action.id}
            noBorder={nextActive || active}
          />
        );
      })}
    </div>
  );
});
