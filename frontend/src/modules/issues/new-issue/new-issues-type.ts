/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { z } from 'zod';

export const NewIssueSchema = z.object({
  description: z.string(),

  stateId: z.string(),

  labelIds: z.array(z.string()),
  priority: z.number(),
  assigneeId: z.optional(z.string()),
  isBidirectional: z.boolean(),
});
