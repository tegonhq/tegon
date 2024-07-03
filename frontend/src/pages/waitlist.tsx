/* eslint-disable @next/next/no-sync-scripts */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Widget } from '@typeform/embed-react';
import { useRouter } from 'next/router';
import React from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { UserContext } from 'store/user-context';

export default function Waitlist() {
  const context = React.useContext(UserContext);
  const router = useRouter();
  const ref = React.useRef(null);

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
    <div className="h-[100vh] w-[100vw] relative">
      <Widget id="spaOtE0P" className="my-form h-[100vh]  w-[100vw]" />
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
