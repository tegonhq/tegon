/* eslint-disable @next/next/no-sync-scripts */
import { Button } from '@tegonhq/ui/components/button';
import Logo from '@tegonhq/ui/components/logo';
import { Widget } from '@typeform/embed-react';
import { useRouter } from 'next/router';
import React from 'react';
import { SessionAuth, signOut } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { UserContext } from 'store/user-context';

export default function Waitlist() {
  const context = React.useContext(UserContext);
  const router = useRouter();

  React.useEffect(() => {
    if (context?.workspaces.length > 0) {
      router.replace(`/${context.workspaces[0].slug}`);
    }

    // Check if they have invites
    if (context?.invites.length > 0) {
      router.replace(`/invites`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.workspaces]);

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col">
      <Widget
        id="spaOtE0P"
        className="my-form h-[calc(100vh_-_50px)] w-[100vw]"
      />
      <div className="flex items-center justify-center gap-2">
        <Logo width={120} height={50} />
        <Button
          variant="secondary"
          onClick={async () => {
            await signOut();

            router.replace('/auth/signin');
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}

Waitlist.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SessionAuth>
      <UserDataWrapper>{page}</UserDataWrapper>
    </SessionAuth>
  );
};
