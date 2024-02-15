/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import * as React from 'react';

import { UserContext } from 'store/user-context';

export function useCurrentWorkspace() {
  const {
    query: { workspaceSlug },
  } = useRouter();
  const userContext = React.useContext(UserContext);

  const currentWorkspace = React.useMemo(
    () =>
      userContext.workspaces.find(
        (workspace) => workspace.slug === workspaceSlug,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceSlug],
  );

  return currentWorkspace;
}
