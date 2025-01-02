import { Button } from '@tegonhq/ui/components/button';
import { Logo } from '@tegonhq/ui/components/dynamic-logo';
import { Loader } from '@tegonhq/ui/components/loader';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import * as React from 'react';
import { signOut } from 'supertokens-auth-react/recipe/session';

import { deleteCookies } from 'common/common-utils';

import { useGetUserQuery } from 'services/users';

import { UserContext } from 'store/user-context';

interface Props {
  children: React.ReactElement;
}

export function UserDataWrapper(props: Props): React.ReactElement {
  const { children } = props;
  const { data, error: isError, isLoading } = useGetUserQuery();
  const {
    query: { workspaceSlug },
    replace,
  } = useRouter();

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
    const workspaceRes = data.workspaces.find(
      (work) => work.slug === workspaceSlug,
    );

    if (workspaceRes.status === 'SUSPENDED') {
      return (
        <div className="flex flex-col h-[100vh] w-[100vw] items-center justify-center gap-2">
          <Logo width={100} height={100} /> Your account is suspended
          <Button
            variant="secondary"
            onClick={async () => {
              posthog.reset(true);
              deleteCookies();
              await signOut();

              replace('/auth');
            }}
          >
            Logout
          </Button>
        </div>
      );
    }

    return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
  }

  return <Loader text="Loading user data" />;
}
