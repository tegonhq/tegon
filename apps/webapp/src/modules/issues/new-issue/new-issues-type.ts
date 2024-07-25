import { z } from 'zod';

export const NewIssueSchema = z.object({
  description: z.string(),
  descriptionString: z.string(),

  stateId: z.string(),

  labelIds: z.array(z.string()),
  priority: z.number(),
  assigneeId: z.optional(z.string()),
  isBidirectional: z.boolean(),
});

export const draftKey = 'CreateIssueDraft';
