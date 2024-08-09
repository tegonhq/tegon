import { createContext } from 'react';

import type { User } from 'common/types';

export const UserContext = createContext<User>(undefined);
