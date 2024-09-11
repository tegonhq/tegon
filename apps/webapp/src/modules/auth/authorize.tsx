import { Logo } from '@tegonhq/ui/components/dynamic-logo';
import { useRouter } from 'next/router';
import React from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { useAuthorizeMutation } from 'services/users';

import { UserContext } from 'store/user-context';

export function Authorize() {
  const router = useRouter();
  const user = React.useContext(UserContext);
  const {
    query: { code },
  } = router;

  const { mutate: authorize } = useAuthorizeMutation({});

  React.useEffect(() => {
    authorize({
      code: code as string,
      workspaceId: user.workspaces[0].id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 container flex items-center flex-col gap-2">
      <Logo width={100} height={100} />
      You have successfully authorised, now you can return back to the cli.
    </div>
  );
}

Authorize.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SessionAuth>
      <UserDataWrapper>{page}</UserDataWrapper>
    </SessionAuth>
  );
};
