import { Loader } from '@tegonhq/ui/components/loader';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { useRouter } from 'next/router';
import React from 'react';
import {
  consumeCode,
  clearLoginAttemptInfo,
} from 'supertokens-web-js/recipe/passwordless';

export function Verify() {
  const router = useRouter();
  const {
    query: { redirectToPath },
  } = router;
  const { toast } = useToast();

  async function handleMagicLinkClicked() {
    try {
      const response = await consumeCode();

      if (response.status === 'OK') {
        // we clear the login attempt info that was added when the createCode function
        // was called since the login was successful.
        await clearLoginAttemptInfo();
        if (
          response.createdNewRecipeUser &&
          response.user.loginMethods.length === 1
        ) {
          toast({
            title: 'Success!',
            description: 'Sign up successfully!',
          });
        } else {
          toast({
            title: 'Success!',
            description: 'Sign in successfully!',
          });
        }
        router.replace(redirectToPath ? (redirectToPath as string) : '/');
      } else {
        // this can happen if the magic link has expired or is invalid
        // or if it was denied due to security reasons in case of automatic account linking

        // we clear the login attempt info that was added when the createCode function
        // was called - so that if the user does a page reload, they will now see the
        // enter email / phone UI again.
        await clearLoginAttemptInfo();
        toast({
          title: 'Error!',
          description: 'Login failed. Please try again',
        });
        router.replace('/auth');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        toast({
          title: 'Error!',
          description: err.message,
        });
        // this may be a custom error message sent from the API by you.
      } else {
        toast({
          title: 'Error!',
          description: 'Oops! Something went wrong.',
        });
      }
    }
  }

  React.useEffect(() => {
    handleMagicLinkClicked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex">
      <Loader text="Verifying token" />
    </div>
  );
}
