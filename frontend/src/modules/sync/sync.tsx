/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useEffect } from 'react';
import React from 'react';
import { io } from 'socket.io-client';

import { saveBootstrapData } from 'common/database-balancer';

import { useWorkspaceStore } from 'store/workspace';

// A Sudo component which connects to the sync server
export const Websocket = () => {
  const { store: workspaceStore } = useWorkspaceStore();

  const socket = io(`http://localhost:3001`, {
    query: {
      workspaceId: workspaceStore.workspace.id,
    },
    extraHeaders: {
      Authorization: 'Bearer 1234',
    },
  });

  useEffect(() => {
    socket.on('message', (newMessage: string) => {
      saveBootstrapData([JSON.parse(newMessage)]);
    });
    return () => {
      socket.off('connect');
      socket.off('message');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
