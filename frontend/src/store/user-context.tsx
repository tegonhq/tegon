/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { createContext } from 'react';

interface Workspace {
  name: string;
  slug: string;
  icon: string;
  id: string;
}

export interface Invite {
  id: string;
  workspaceId: string;
  workspace: Workspace;
  status: 'ACCEPTED' | 'INVITED';
}

export interface User {
  fullname: string;
  email: string;
  id: string;
  username: string;
  workspaces: Workspace[];
  invites: Invite[];
}

export const UserContext = createContext<User>(undefined);
