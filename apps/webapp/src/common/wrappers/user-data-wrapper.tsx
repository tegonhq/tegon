import { Loader } from '@tegonhq/ui/components/loader';
import posthog from 'posthog-js';
import * as React from 'react';

import { useGetUserQuery } from 'services/users';

import { UserContext } from 'store/user-context';

interface Props {
  children: React.ReactElement;
}

export function UserDataWrapper(props: Props): React.ReactElement {
  const { children } = props;
  const { data, error: isError, isLoading } = useGetUserQuery();

  React.useEffect(() => {
    if (!isLoading && !isError) {
      posthog.identify(
        data.id, // Replace 'distinct_id' with your user's unique identifier
        { email: data.email, name: data.fullname }, // optional: set additional person properties
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!isLoading, !isError]);

  if (!isLoading && !isError) {
    return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
  }

  return <Loader text="Loading user data" />;
}
