/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { createContext } from 'react';

interface Workspace {
  name: string;
  slug: string;
  icon: string;
}

export interface User {
  fullname: string;
  email: string;
  id: string;
  username: string;
  workspaces: Workspace[];
}

export const UserContext = createContext<User>(undefined);
