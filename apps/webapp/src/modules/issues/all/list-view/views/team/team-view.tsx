import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useTeams } from 'hooks/teams';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { TeamBoard } from './team-board';
import { TeamList } from './team-list';

export const TeamView = observer(() => {
  const {
    applicationStore: {
      displaySettings: { view },
    },
  } = useContextStore();
  const teams = useTeams();

  return view === ViewEnum.list ? (
    <TeamList teams={teams} />
  ) : (
    <TeamBoard teams={teams} />
  );
});
