/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Subscription } from 'dexie';
import { useRouter } from 'next/router';
import * as React from 'react';

import { tegonDatabase } from 'store/database';
import {
  subscribeToLabelChanges,
  subscribeToSequenceChanges,
  subscribeToTeamChanges,
  subscribeToWorkflowChanges,
  subscribeToWorkspaceChanges,
} from 'store/subscribe';

interface SyncProvider {
  children: React.ReactNode;
}

interface SubscriberMap {
  workspace?: Subscription | undefined;
  label?: Subscription | undefined;
  sequence?: Subscription | undefined;
  team?: Subscription | undefined;
  workflow?: Subscription | undefined;
}

export const IDBToMSTProvider = ({ children }: SyncProvider) => {
  const {
    query: { teamIdentifier },
  } = useRouter();

  const [subscribers, setSubscribers] = React.useState<SubscriberMap>({});

  React.useEffect(() => {
    subscribe();

    return () => {
      Object.keys(subscribers).forEach((key: keyof SubscriberMap) =>
        subscribers[key].unsubscribe(),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdentifier]);

  const subscribe = React.useCallback(async () => {
    await tegonDatabase.open();

    setSubscribers({
      // subscribe to workspace changes
      workspace: subscribeToWorkspaceChanges(tegonDatabase),
      // Subscribe to labels
      label: subscribeToLabelChanges(tegonDatabase),
      // Subscribe to last sequence Id
      sequence: subscribeToSequenceChanges(tegonDatabase),
      // Subscribe to team changes
      team: subscribeToTeamChanges(tegonDatabase),
    });

    if (teamIdentifier && !subscribers.workflow) {
      const team = await tegonDatabase.team.get({ identifier: teamIdentifier });

      setSubscribers({
        ...subscribers,
        // All stores depended on the team
        // Subscribe to workflow changes
        workflow: subscribeToWorkflowChanges(tegonDatabase, team.id),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdentifier]);

  return <>{children}</>;
};
