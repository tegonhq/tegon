import { useGetUserQuery } from '@tegonhq/services/users';
import { Loader } from '@tegonhq/ui/components/loader';
import * as React from 'react';

import { UserContext } from 'store/user-context';

interface Props {
  children: React.ReactElement;
}

export function UserDataWrapper(props: Props): React.ReactElement {
  const { children } = props;
  const { data, error: isError, isLoading } = useGetUserQuery();

  if (!isLoading && !isError) {
    return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
  }

  return <Loader text="Loading user data" />;
}
