/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';

import { Loader } from 'components/ui/loader';

import { useContextStore } from 'store/global-context-provider';

export default function WorkspaceHome() {
  const { teamsStore } = useContextStore();
  const {
    push,
    query: { workspaceSlug },
  } = useRouter();

  React.useEffect(() => {
    const team = teamsStore.teams[0];
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
