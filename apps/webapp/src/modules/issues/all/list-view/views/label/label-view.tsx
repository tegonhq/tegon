import { observer } from 'mobx-react-lite';

import { useComputedLabels } from 'hooks/labels';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { LabelBoard } from './label-board';
import { LabelList } from './label-list';

export const LabelView = observer(() => {
  const {
    applicationStore: {
      displaySettings: { view },
    },
  } = useContextStore();

  const { labels } = useComputedLabels();

  return view === ViewEnum.list ? (
    <LabelList labels={labels} />
  ) : (
    <LabelBoard labels={labels} />
  );
});
