import { Loader } from '@tegonhq/ui/components/loader';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { UserContext } from 'store/user-context';

export default function Home() {
  const context = React.useContext(UserContext);
  const router = useRouter();

  React.useEffect(() => {
    if (context?.workspaces.length > 0) {
      router.replace(`/${context.workspaces[0].slug}`);
    }

    // Check if they have invites
    else if (context?.invites.length > 0) {
      router.replace(`/invites`);
    }

    // Check if they have invites
    else {
      router.replace(`/onboarding`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.workspaces]);

  return <Loader />;
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SessionAuth>
      <UserDataWrapper>{page}</UserDataWrapper>
    </SessionAuth>
  );
};
