/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { z } from 'zod';

export const NewIssueSchema = z.object({
  description: z.string().min(2).max(50),
});
