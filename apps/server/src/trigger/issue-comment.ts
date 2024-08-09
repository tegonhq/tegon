// import { PrismaClient } from '@prisma/client';
// import {
//   IntegrationPayloadEventType,
//   IssueCommentSyncPayload,
//   ModelNameEnum,
// } from '@tegonhq/types';
// import { task } from '@trigger.dev/sdk/v3';

// import { triggerTask } from 'common/utils/trigger.utils';

// const prisma = new PrismaClient();
// export const issueCommentTrigger = task({
//   id: `${ModelNameEnum.IssueComment}-trigger`,
//   // TODO(Manoj) Fix type for this payload
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   run: async (payload: any) => {
//     const issueComment = await prisma.issueComment.findUnique({
//       where: { id: payload.modelId },
//       include: { parent: true },
//     });

//     const parentSourceMetadata = issueComment?.parent?.sourceMetadata as Record<
//       string,
//       string
//     >;

//     if (parentSourceMetadata) {
//       const integrationAccount = await prisma.integrationAccount.findUnique({
//         where: {
//           id: parentSourceMetadata.id,
//           deleted: null,
//         },
//         include: {
//           integrationDefinition: true,
//           workspace: true,
//         },
//       });

//       triggerTask(
//         `${integrationAccount?.integrationDefinition.name.toLowerCase()}-handler`,
//         {
//           event: IntegrationPayloadEventType.CommentSync,
//           payload: {
//             userId: issueComment.userId,
//             data: {
//               modelName: ModelNameEnum.IssueComment,
//               accountId: integrationAccount.accountId,
//               issueComment,
//               action: payload.isDeleted ? 'delete' : payload.action,
//             } as IssueCommentSyncPayload,
//           },
//         },
//       );
//     }

//     return {
//       message: 'Hello, world!',
//     };
//   },
// });
