import type { LabelType } from '@tegonhq/types';

import { observer } from 'mobx-react-lite';

import { useTeamLabels } from 'hooks/labels';
import { useCurrentTeam } from 'hooks/teams';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { LabelBoard } from './label-board-view';
import { LabelListView } from './label-list-view';

export const LabelView = observer(() => {
  const team = useCurrentTeam();
  const {
    applicationStore: {
      filters: { label: labelFilters },
      displaySettings: { view },
    },
  } = useContextStore();
  let labels = useTeamLabels(team.identifier);
  labels = labelFilters
    ? labels.filter((label: LabelType) => labelFilters.value.includes(label.id))
    : labels;

  return view === ViewEnum.list ? (
    <LabelListView labels={labels} />
  ) : (
    <LabelBoard labels={labels} />
  );
});
