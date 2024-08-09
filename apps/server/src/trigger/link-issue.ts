// import { Prisma, PrismaClient } from '@prisma/client';
// import {
//   IntegrationDefinition,
//   IntegrationPayloadEventType,
//   LinkedIssue,
//   LinkIssuePayload,
// } from '@tegonhq/types';
// import { task } from '@trigger.dev/sdk/v3';

// import { triggerTask } from 'common/utils/trigger.utils';

// const prisma = new PrismaClient();

// export const linkIssueTrigger = task({
//   id: 'link-issue',
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   run: async (payload: any) => {
//     const linkedIssue: LinkedIssue = payload.linkedIssue;

//     const integrationDefinitions: Array<
//       IntegrationDefinition & { matchedRegex: Record<string, string> }
//     > = await prisma.$queryRaw`
//         SELECT *, r as "matchedRegex"
//         FROM "IntegrationDefinition" i
//         CROSS JOIN LATERAL jsonb_array_elements(i.spec->'link_regex') AS r
//         WHERE ${linkedIssue.url} ~ (r->>'regex')
//         LIMIT 1;
//     `;

//     if (integrationDefinitions.length < 1) {
//       return {
//         message: `Couldn't find any integration definition for this URL ${linkedIssue.url}`,
//       };
//     }

//     const integrationAccount = await prisma.integrationAccount.findFirst({
//       where: {
//         settings: {
//           path: ['mappings'],
//           array_contains: [{ teamId: linkedIssue.issue.teamId }],
//         } as Prisma.JsonFilter,
//         isActive: true,
//         integrationDefinitionId: integrationDefinitions[0].id,
//       },
//     });

//     const handle = await triggerTask(
//       `${integrationDefinitions[0].name.toLowerCase()}-handler`,
//       {
//         event: IntegrationPayloadEventType.LinkIssueSync,
//         payload: {
//           userId: linkedIssue.createdById,
//           data: {
//             accountId: integrationAccount.accountId,
//             linkIssueId: linkedIssue.id,
//             matchedRegex: integrationDefinitions[0].matchedRegex.regex,
//             matchedRegexType: integrationDefinitions[0].matchedRegex.type,
//           } as LinkIssuePayload,
//         },
//       },
//     );

//     return {
//       message: `Triggered handler task with id: ${handle.id}`,
//     };
//   },
// });
