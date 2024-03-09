/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { z } from 'zod';

export const ProfileSchema = z.object({
  fullname: z
    .string()
    .min(2, {
      message: 'User name must be atleast 2 characters',
    })
    .max(50),
  username: z
    .string()
    .min(2, {
      message: 'User name must be atleast 2 characters',
    })
    .max(10),
});
