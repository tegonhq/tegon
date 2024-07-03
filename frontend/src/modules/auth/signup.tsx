/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import { RiGoogleFill } from '@remixicon/react';
import getConfig from 'next/config';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';

import { AuthLayout } from 'common/layouts/auth-layout';
import { AuthGuard } from 'common/wrappers/auth-guard';

import { Button } from 'components/ui/button';
const { publicRuntimeConfig } = getConfig();

export function SignUp() {
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
        <h1 className="text-2xl font-semibold text-center">Sign up</h1>
        <div className="text-sm text-center text-muted-foreground mt-1 mb-8">
          to continue to Tegon
        </div>

        <Button className="flex gap-2" size="lg" onClick={googleSignInClicked}>
          <RiGoogleFill size={18} /> Sign up with google
        </Button>

        <div className="mt-4 text-xs text-muted-foreground">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </div>
    </AuthLayout>
  );
}

SignUp.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthGuard>{page}</AuthGuard>;
};
