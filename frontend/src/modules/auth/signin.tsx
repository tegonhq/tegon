/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import { AuthLayout } from 'common/layouts/auth-layout';
import { AuthGuard } from 'common/wrappers/auth-guard';

import { SignForm } from './signin-form';

export function SignIn() {
  return (
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-lg text-center">Sign in</h1>
        <div className="text-center text-muted-foreground mt-1 mb-8">
          to continue to Tegon
        </div>

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
