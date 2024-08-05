import type { User } from 'common/types';

import { createContext } from 'react';

export const UserContext = createContext<User>(undefined);
