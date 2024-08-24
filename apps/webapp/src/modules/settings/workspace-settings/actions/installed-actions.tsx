import type { ActionType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { InstalledActionCard } from './installed-action-card';

export function InstalledActions() {
  const { actionsStore } = useContextStore();

  const actions = actionsStore.actions;

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action: ActionType) => (
        <InstalledActionCard action={action} key={action.id} />
      ))}
    </div>
  );
}
