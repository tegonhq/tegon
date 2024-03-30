/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { z } from 'zod';

export const OverviewSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Workspace name must be atleast 2 characters',
    })
    .max(50),
});
