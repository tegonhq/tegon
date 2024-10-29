import { observer } from 'mobx-react-lite';

import type { LabelType } from 'common/types';

import { useTeamLabels } from 'hooks/labels';
import { useCurrentTeam } from 'hooks/teams';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { LabelBoard } from './label-board';
import { LabelList } from './label-list';

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
    <LabelList labels={labels} />
  ) : (
    <LabelBoard labels={labels} />
  );
});
