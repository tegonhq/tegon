import { z } from 'zod';

export const SecuritySchema = z.object({
  oldPassword: z.string().min(2, {
    message: 'Password should be atleast 2 characters',
  }),
  newPassword: z.string().min(2, {
    message: 'Password should be atleast 2 characters',
  }),
});
