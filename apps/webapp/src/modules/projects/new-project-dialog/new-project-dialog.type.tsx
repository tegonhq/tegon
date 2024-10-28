import { z } from 'zod';

export const NewProjectSchema = z.object({
  description: z.optional(z.string()),
  name: z.string().min(3),

  endDate: z.optional(z.string()),
  status: z.string(),
  leadUserId: z.optional(z.string()),
  teams: z.array(z.string()),
});
