/** Copyright (c) 2024, Tegon, all rights reserved. **/

import SuperTokensReact from 'supertokens-auth-react';

import { frontendConfig } from 'common/lib/config';

export function initSuperTokens() {
  // Initialise Supertokens
  if (typeof window !== 'undefined') {
    // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'

    SuperTokensReact.init(frontendConfig());
  }
}
