/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import React from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { Loader } from 'components/ui/loader';
import { useToast } from 'components/ui/use-toast';

import {
  useSentryConnectMutation,
  type SentryConnectParams,
} from 'services/oauth';

import { UserContext } from 'store/user-context';

export function Sentry() {
  const { query } = useRouter();
  const { toast } = useToast();

  const user = React.useContext(UserContext);
  const { mutate: connectSentry } = useSentryConnectMutation({
    onSuccess: () => window.close(),
    onError: (e) => {
      toast({
        title: 'Error connecting sentry',
        description: e,
      });

      setTimeout(() => window.close(), 5000);
    },
  });

  async function handleSentryConnect() {
    try {
      // Fix: do a direct cast
      const params = query as unknown as SentryConnectParams;
      connectSentry({ ...params, workspaceId: user.workspaces[0].id });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {}
  }

  React.useEffect(() => {
    handleSentryConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loader text="Handling sentry connect..." />;
}

Sentry.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SessionAuth>
      <UserDataWrapper>{page}</UserDataWrapper>
    </SessionAuth>
  );
};
