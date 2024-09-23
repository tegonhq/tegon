import { Loader } from '@tegonhq/ui/components/loader';
import { useRouter } from 'next/router';
import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import type { TeamType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { UserContext } from '../../store/user-context';

export default function WorkspaceHome() {
  const user = React.useContext(UserContext);
  const { teamsStore, workspaceStore } = useContextStore();
  const {
    push,
    query: { workspaceSlug },
  } = useRouter();

  React.useEffect(() => {
    const teamAccessList = workspaceStore.getUserData(user.id).teamIds;

    const team = teamsStore.teams.filter((team: TeamType) =>
      teamAccessList.includes(team.id),
    )[0];

    push(`/${workspaceSlug}/team/${team.identifier}/all`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex items-center">
      <Loader />
    </div>
  );
}

WorkspaceHome.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
