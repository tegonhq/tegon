/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { createContext } from 'react';

interface Workspace {
  slug: string;
  id: string;
  anonymousDataCollection: boolean;
  initialSetupComplete: boolean;
}

export interface User {
  fullname: string;
  email: string;
  id: string;
  Workspace: Workspace[];
}

export const UserContext = createContext<User>(undefined);
