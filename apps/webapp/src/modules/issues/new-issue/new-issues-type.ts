import { z } from 'zod';

export const BaseIssueSchema = z.object({
  description: z.optional(z.string()),
  title: z.string(),

  stateId: z.string(),

  labelIds: z.array(z.string()),
  priority: z.number(),
  assigneeId: z.optional(z.string()),
  parentId: z.optional(z.string()),
  teamId: z.optional(z.string()),
  projectId: z.optional(z.string()),
  projectMilestoneId: z.optional(z.string()),
});

export const NewIssueSchema = z.object({
  issues: z.array(BaseIssueSchema),
});

export const draftKey = 'CreateIssueDraft';
