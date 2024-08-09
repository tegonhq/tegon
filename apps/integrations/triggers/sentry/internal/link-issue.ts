// import {
//   CreateLinkIssueInput,
//   IntegrationAccount,
//   LinkIssuePayload,
// } from '@tegonhq/types';
// import { AbortTaskRunError } from '@trigger.dev/sdk/v3';
// import axios from 'axios';

// import { sentryRegex } from '../types';
// import { getSentryIssue } from '../utils';

// export const sentryLinkIssue = async (
//   integrationAccount: IntegrationAccount,
//   data: LinkIssuePayload,
// ) => {
//   const { url, userId, issueId, type } = data;

//   const sentryMatch = url.match(sentryRegex);
//   if (!sentryMatch) {
//     throw new AbortTaskRunError("Sentry link didn't match with link regex");
//   }

//   // Initialize the linkIssueData with default values
//   const linkIssueData: CreateLinkIssueInput = {
//     url,
//     issueId,
//     createdById: userId,
//     source: { type: 'ExternalLink' },
//     sourceData: {},
//   };

//   const [, orgSlug, sentryIssueId] = sentryMatch;

//   if (integrationAccount) {
//     const sentryResponse = await getSentryIssue(
//       integrationAccount,
//       orgSlug,
//       sentryIssueId,
//     );

//     if (sentryResponse.status === 200) {
//       const sentryData = sentryResponse.data;
//       linkIssueData.source = { type, syncedCommentId: null };
//       linkIssueData.sourceData = {
//         title: sentryData.title,
//         projectId: sentryData.project.id,
//         projectName: sentryData.project.name,
//         type: sentryData.type,
//         metadata: {
//           value: sentryData.metadata.value,
//           type: sentryData.metadata.type,
//           filename: sentryData.metadata.filename,
//         },
//         firstSeen: sentryData.firstSeen,
//         issueType: sentryData.issueType,
//         issueCategory: sentryData.issueCategory,
//       };
//     }
//   }

//   // Create the linked issue
//   return (
//     await axios.post(
//       `${process.env.BACKEND_HOST}/v1/linked_issues`,
//       linkIssueData,
//     )
//   ).data;
// };
