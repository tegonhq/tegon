/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { frontendConfig } from 'lib/config';
import SuperTokensReact from 'supertokens-auth-react';

import { tegonDatabase } from 'store/database';
import {
  subscribeToLabelChanges,
  subscribeToSequenceChanges,
  subscribeToWorkspaceChanges,
} from 'store/subscribe';

// Init all loosely held configs
export function init() {
  // Initialise Supertokens
  if (typeof window !== 'undefined') {
    // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'

    SuperTokensReact.init(frontendConfig());
  }

  // Once the indexedDB database is ready initiate hooks to keep the mobx-store upto date
  tegonDatabase.on('ready', () => {
    // subscribe to workspace changes
    subscribeToWorkspaceChanges(tegonDatabase);
    // Subscribe to labels
    subscribeToLabelChanges(tegonDatabase);
    // Subscribe to last sequence Id
    subscribeToSequenceChanges(tegonDatabase);
  });
}
