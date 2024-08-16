// import {
//   IntegrationAccount,
//   LinkIssuePayload,
//   UpdateLinkIssueInput,
// } from '@tegonhq/types';
// import { AbortTaskRunError, logger } from '@trigger.dev/sdk/v3';
// import axios from 'axios';

// import { getGithubHeaders } from '../utils';

// export const githubLinkIssueSync = async (
//   integrationAccount: IntegrationAccount,
//   data: LinkIssuePayload,
// ) => {
//   // const { url, userId, issueId, type, subType } = data;
//   const { linkIssueId, matchedRegex, matchedRegexType: type } = data;

//   const githubRegex = new RegExp(matchedRegex, 'i');

//   // Check if the type is GithubPullRequest
//   const isGithubPR = type === 'GithubPullRequest';
//   logger.log(`Is GitHub PR: ${isGithubPR}`);

//   let linkedIssue = (
//     await axios.get(
//       `${process.env.BACKEND_HOST}/v1/linked_issues/${linkIssueId}`,
//     )
//   ).data;

//   // Match the url against the githubPRRegex or githubIssueRegex based on isGithubPR
//   const githubUrlMatch = linkedIssue.url.match(githubRegex);

//   if (!githubUrlMatch) {
//     throw new AbortTaskRunError("Github link didn't match with link regex");
//   }

//   // Initialize the linkIssueData with default values
//   const linkIssueData: UpdateLinkIssueInput = {
//     source: { type: 'ExternalLink' },
//     sourceData: { title: `Github ${isGithubPR ? 'PR' : 'Issue'}` },
//   };
//   logger.debug(`Initial link issue data: ${linkIssueData}`);

//   // Get the Github access token for the integration account
//   const githubAccessToken = await getBotAccessToken(integrationAccount);

//   // Fetch the issue or PR data from the Github API
//   const response =
//     (
//       await axios(
//         convertToAPIUrl(linkedIssue.url, type),
//         getGithubHeaders(githubAccessToken),
//       )
//     ).data ?? {};

//   // If response exists, update the linkIssueData with the fetched data
//   if (response) {
//     linkIssueData.sourceId = response.id.toString();
//     linkIssueData.sourceData = isGithubPR
//       ? {
//           branch: response.head.ref,
//           id: response.id.toString(),
//           closedAt: response.closed_at,
//           createdAt: response.created_at,
//           updatedAt: response.updated_at,
//           number: response.number,
//           state: response.state,
//           title: response.title,
//           apiUrl: response.url,
//           mergedAt: response.merged_at,
//         }
//       : {
//           id: response.id.toString(),
//           title: response.title,
//           apiUrl: response.url,
//         };

//     linkIssueData.source = isGithubPR
//       ? {
//           type,
//           pullRequestId: response.id,
//         }
//       : {
//           type,
//         };
//   }

//   // Update the linked issue
//   linkedIssue = (
//     await axios.post(
//       `${process.env.BACKEND_HOST}/v1/linked_issues/${linkIssueId}`,
//       linkIssueData,
//     )
//   ).data;

//   logger.log(`Linked issue created: ${linkedIssue.id}`);
//   // Destructure the required data from the linkedIssue
//   const {
//     issue: {
//       id: issueId,
//       number: issueNumber,
//       title: issueTitle,
//       team: { identifier: teamIdentifier },
//     },
//   } = linkedIssue;

//   // Construct the Github comment body
//   const githubCommentBody = `[${teamIdentifier}-${issueNumber} ${issueTitle}](${process.env.PUBLIC_FRONTEND_HOST}/${integrationAccount.workspace.slug}/issue/${teamIdentifier}-${issueNumber})`;

//   // Send the Github comment
//   await sendGithubComment(
//     linkIssueData.source.apiUrl,
//     githubAccessToken,
//     githubCommentBody,
//   );
//   logger.log('GitHub comment sent');

//   // Create the issue comment and update link issue with synced comment
//   await createLinkIssueComment(linkIssueData, issueId, issueTitle, linkIssueId);
//   logger.log('Link issue comment created');

//   return linkedIssue;
// };
