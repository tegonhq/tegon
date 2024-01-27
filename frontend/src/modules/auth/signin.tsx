/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import { AuthLayout } from 'layouts/auth-layout';

import { LoggedInGuard } from 'components/wrappers/login-guard';

import { SignForm } from './signin-form';

export function SignIn() {
  return (
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        <div className="text-sm text-center text-muted-foreground mt-1 mb-8">
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
  return <LoggedInGuard>{page}</LoggedInGuard>;
};
