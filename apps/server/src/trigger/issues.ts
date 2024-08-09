// import { PrismaClient } from '@prisma/client';
// import {
//   IntegrationAccount,
//   IntegrationPayloadEventType,
//   ModelNameEnum,
// } from '@tegonhq/types';
// import { task, tasks } from '@trigger.dev/sdk/v3';

// const prisma = new PrismaClient();
// export const issueTrigger = task({
//   id: `${ModelNameEnum.Issue}-trigger`,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   run: async (payload: any) => {
//     if (payload.isDeleted) {
//       return { message: 'Issue is deleted' };
//     }
//     const issue = await prisma.issue.findUnique({
//       where: { id: payload.modelId },
//       include: { linkedIssue: true, team: true },
//     });

//     if (issue.isBidirectional) {
//       if (issue.linkedIssue.length > 0) {
//         // TODO(Manoj): Remove personal integration accounts
//         const integrationAccounts = await prisma.integrationAccount.findMany({
//           where: { workspaceId: issue.team.workspaceId, deleted: null },
//           include: { integrationDefinition: true },
//         });
//         integrationAccounts.map((integrationAccount: IntegrationAccount) => {
//           tasks.trigger(
//             `${integrationAccount.integrationDefinition.name.toLowerCase()}-handler`,
//             {
//               integrationAccount,
//               actionType: IntegrationPayloadEventType.IssueSync,
//               payload: {
//                 modelName: ModelNameEnum.Issue,
//                 modelPayload: { issue },
//               },
//             },
//           );
//         });

//         return { message: 'Creating a Issue in the source' };
//       }
//     }

//     return {
//       message: 'Successfull',
//     };
//   },
// });
