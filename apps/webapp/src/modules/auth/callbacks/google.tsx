import { Loader } from '@tegonhq/ui/components/loader';
import React from 'react';
import { thirdPartySignInAndUp } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';

export function Google() {
  async function handleGoogleCallback() {
    try {
      const response = await thirdPartySignInAndUp();

      if (response.status === 'OK') {
        window.location.assign('/');
      } else if (response.status === 'SIGN_IN_UP_NOT_ALLOWED') {
        console.error(response.reason);
      } else {
        // SuperTokens requires that the third party provider
        // gives an email for the user. If that's not the case, sign up / in
        // will fail.

        console.error(
          'No email provided by social login. Please use another form of login',
        );
        window.location.assign('/auth'); // redirect back to login page
      }
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

  React.useEffect(() => {
    handleGoogleCallback();
  }, []);

  return <Loader text="Signing up..." />;
}
