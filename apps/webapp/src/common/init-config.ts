import getConfig from 'next/config';
import posthog from 'posthog-js';
import SuperTokensReact from 'supertokens-auth-react';

import { frontendConfig } from 'common/lib/config';

const { publicRuntimeConfig } = getConfig();

export function initSuperTokens() {
  // Initialise Supertokens
  if (typeof window !== 'undefined') {
    // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'

    SuperTokensReact.init(frontendConfig());
  }
}

export function initPosthog() {
  if (typeof window !== 'undefined') {
    // checks that we are client-side
    posthog.init(publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_HOST ||
        'https://us.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug();
        } // debug mode in development
      },
    });
  }
}
