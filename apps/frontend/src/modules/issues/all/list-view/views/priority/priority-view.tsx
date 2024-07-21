import { observer } from 'mobx-react-lite';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { PriorityBoard } from './priority-board';
import { PriorityList } from './priority-list';

export const PriorityView = observer(() => {
  const {
    applicationStore: {
      displaySettings: { view },
    },
  } = useContextStore();

  return view === ViewEnum.list ? <PriorityList /> : <PriorityBoard />;
});
