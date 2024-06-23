/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import * as React from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { Loader } from 'components/ui/loader';

import { UserContext } from 'store/user-context';

export default function Home() {
  const context = React.useContext(UserContext);
  const router = useRouter();

  React.useEffect(() => {
    if (context?.workspaces.length > 0) {
      router.replace(`/${context.workspaces[0].slug}`);
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
