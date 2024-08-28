/* eslint-disable react/no-unescaped-entities */

import { useRouter } from 'next/router';
import React from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { AuthLayout } from 'common/layouts/auth-layout';
import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { UserContext } from 'store/user-context';

import { OnboardingForm } from './onboarding-form';

export function Onboarding() {
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
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-lg">✋ Welcome to Tegon</h1>
        <div className="text-muted-foreground mt-1 mb-8">
          We just need to take couple of information before we proceed
        </div>

        <div className="flex flex-col gap-2">
          <OnboardingForm />
        </div>
      </div>
    </AuthLayout>
  );
}

Onboarding.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SessionAuth>
      <UserDataWrapper>{page}</UserDataWrapper>
    </SessionAuth>
  );
};
