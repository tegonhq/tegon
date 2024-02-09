/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { saveBootstrapData } from 'common/database-balancer';

import { UserContext } from 'store/user_context';
import { useWorkspaceStore } from 'store/workspace';

import { Loader } from '../../components/ui/loader';

interface Props {
  children: React.ReactElement;
}

const Models = ['Workspace'];

// This wrapper ensures call is either made to bootstrap or delta/sync to get be upto date with the server
export const DataSyncWrapper: React.FC<Props> = observer((props: Props) => {
  const { children } = props;
  const { store: workspaceStore, isLoading } = useWorkspaceStore();
  const userContext = React.useContext(UserContext);
  const { query } = useRouter();
  const currentWorkspace = userContext.workspaces.find(
    (workspace) => workspace.slug === query.workspaceSlug,
  );

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!workspaceStore?.workspace && !isLoading) {
      callBootstrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore, isLoading]);

  const callBootstrap = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/v1/sync_actions/bootstrap?workspaceId=${currentWorkspace.id}&models=${Models.join(',')}`,
    );
    const bootstrapData = await response.json();

    await saveBootstrapData(bootstrapData);

    setLoading(false);
  };

  if (workspaceStore?.workspace && !loading && !isLoading) {
    return <>{children}</>;
  }

  return <Loader />;
});
