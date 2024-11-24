import { Loader } from '@tegonhq/ui/components/loader';
import getConfig from 'next/config';
import * as React from 'react';

import { hash } from 'common/common-utils';

import { useCurrentWorkspace } from 'hooks/workspace';

import { initDatabase } from 'store/database';
import { UserContext } from 'store/user-context';
const { publicRuntimeConfig } = getConfig();

interface Props {
  children: React.ReactElement;
}

export function DatabaseWrapper(props: Props): React.ReactElement {
  const { children } = props;
  const workspace = useCurrentWorkspace();
  const user = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const hashKey = `${workspace.id}__${user.id}`;

  React.useEffect(() => {
    if (workspace) {
      const version = localStorage.getItem('version');
      if (version !== publicRuntimeConfig.NEXT_PUBLIC_VERSION) {
        localStorage.setItem(
          'version',
          publicRuntimeConfig.NEXT_PUBLIC_VERSION,
        );
      }

      initDatabase(hash(hashKey));
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  if (loading) {
    return <Loader text="Starting database..." />;
  }

  return <>{children}</>;
}
