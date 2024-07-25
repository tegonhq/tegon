'use client';

import { RiGoogleFill } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import { Separator } from '@tegonhq/ui/components/separator';
import getConfig from 'next/config';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';

import { AuthLayout } from 'common/layouts/auth-layout';
import { AuthGuard } from 'common/wrappers/auth-guard';

import { SignForm } from './signin-form';

const { publicRuntimeConfig } = getConfig();

export function SignIn() {
  async function googleSignInClicked() {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: 'google',

        frontendRedirectURI: `${publicRuntimeConfig.NEXT_PUBLIC_BASE_HOST}/auth/callback/google`,
      });

      window.location.assign(authUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        console.error(err.message);
      } else {
        console.error('Oops! Something went wrong.');
      }
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-lg text-center">Sign in</h1>
        <div className="text-center text-muted-foreground mt-1 mb-8">
          to continue to Tegon
        </div>

        <Button className="flex gap-2" size="lg" onClick={googleSignInClicked}>
          <RiGoogleFill size={18} /> Sign in with google
        </Button>

        <Separator className="mt-4" />

        <SignForm />

        <div className="mt-4 text-xs text-muted-foreground">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </div>
    </AuthLayout>
  );
}

SignIn.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthGuard>{page}</AuthGuard>;
};
