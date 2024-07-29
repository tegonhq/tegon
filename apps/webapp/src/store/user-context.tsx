import type { User } from '@tegonhq/types';

import { createContext } from 'react';

export const UserContext = createContext<User>(undefined);
