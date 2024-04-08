/** Copyright (c) 2024, Tegon, all rights reserved. **/

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
      displaySettings: { view },
    },
  } = useContextStore();
  const labels = useTeamLabels(team.identifier);

  return view === ViewEnum.list ? (
    <LabelListView labels={labels} />
  ) : (
    <LabelBoard labels={labels} />
  );
});
