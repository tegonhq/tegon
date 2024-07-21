import * as React from 'react';

import { useGetUserQuery } from 'services/users/get-user';

import { UserContext } from 'store/user-context';

import { Loader } from '../../components/ui/loader';

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
