import {
  ActionEventPayload,
  createLinkedIssue,
  getIssueByNumber,
  getLinkedIssueBySource,
  getLinkedIssuesByIssueId,
  getTeamByName,
  JsonObject,
  LinkedIssue,
  logger,
  updateIssue,
  updateLinkedIssue,
} from '@tegonhq/sdk';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { getState, sendGithubComment } from 'utils';

export const prSync = async (actionPayload: ActionEventPayload) => {
  const {
    eventBody,
    integrationAccounts: { github: integrationAccount },
  } = actionPayload;

  const { botToken } = integrationAccount.integrationConfiguration;

  const { pull_request: pullRequest, action, sender } = eventBody;
  const branchName = pullRequest.head.ref;

  const pullRequestId = pullRequest.id.toString();
  const stateDate = pullRequest.closed_at
    ? pullRequest.closed_at
    : pullRequest.created_at;

  // Preparing source data for linked issue
  const sourceData = {
    branch: pullRequest.head.ref,
    id: pullRequestId,
    closedAt: pullRequest.closed_at,
    createdAt: pullRequest.created_at,
    updatedAt: pullRequest.updated_at,
    issueNumber: pullRequest.number,
    state: pullRequest.state,
    title: `#${pullRequest.number} - ${pullRequest.title}    -- ${pullRequest.state} ${formatDistanceToNow(new Date(stateDate), { addSuffix: true })}`,
    apiUrl: pullRequest.url,
    htmlUrl: pullRequest.html_url,
    commentApiUrl: pullRequest.comments_url,
    mergedAt: pullRequest.merged_at,
    githubType: 'PR',
    type: integrationAccount.integrationDefinition.slug,
  };

  switch (action) {
    case 'opened': {
      const branchNameRegex = /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)-(\d+)$/;
      // Checking branch name is matching with regex
      const match = branchName.match(branchNameRegex);

      logger.log(
        `Handling pull request event: action=${action}, branchName=${branchName}`,
      );

      if (!match) {
        logger.log(
          `Branch name ${branchName} does not match the expected format`,
        );
        return undefined;
      }

      // Extracting username, team name and issue number from the regex match
      const [, userName, teamSlug, issueNumber] = match;

      logger.log(
        `Extracted from branch name: userName=${userName}, teamSlug=${teamSlug}, issueNumber=${issueNumber}`,
      );

      // Getting user and team models using names of team and users
      const [team] = await Promise.all([
        getTeamByName({
          slug: teamSlug,
          workspaceId: integrationAccount.workspaceId,
        }),
      ]);

      const issue = await getIssueByNumber({
        number: Number(issueNumber),
        teamId: team.id,
      });

      if (!team || !issue) {
        logger.log(
          `User, team, or issue not found: team=${team}, issue=${issue}`,
        );
        return undefined;
      }

      // On opening a PR, it's creating a link to the issue
      const linkedIssue = await createLinkedIssue({
        url: pullRequest.html_url,
        sourceId: pullRequestId,
        issueId: issue.id,
        sourceData,
        teamId: team.id,
      });
      logger.log(`Created linked issue: linkedIssue=${linkedIssue.id}`);

      // Sending linked message to the PR
      // Create the GitHub comment body with a link to the issue
      const githubCommentBody = `[${team.identifier}-${issue.number} ${issue.title}](https://app.tegon.ai/${team.workspace.slug}/issue/${team.identifier}-${issue.number})`;

      // Send the comment to GitHub
      await sendGithubComment(
        pullRequest.comments_url,
        botToken,
        githubCommentBody,
      );
      return linkedIssue;
    }

    case 'closed': {
      /** On closed, checking for all linked PR's, only updating status of ticket
       * when all other linked PR's are closed or only one linked PR
       * */
      const linkedIssues = await getLinkedIssueBySource({
        sourceId: pullRequestId,
      });

      return await Promise.all(
        linkedIssues.map(async (linkedIssue: LinkedIssue) => {
          const linkedIssuesForIssue = await getLinkedIssuesByIssueId({
            issueId: linkedIssue.issueId,
          });
          const openPRs = linkedIssuesForIssue.filter(
            (linkedIssue) =>
              (linkedIssue.sourceData as JsonObject).githubType === 'PR' &&
              (linkedIssue.sourceData as JsonObject).state === 'open',
          );

          const linkedIssueMap = openPRs.reduce(
            (map, linkedIssue) => map.set(linkedIssue.sourceId, linkedIssue.id),
            new Map<string, string>(),
          );

          logger.log(
            `Found ${openPRs.length} open pull requests for issue ${linkedIssue.issueId}`,
          );
          // Checking if the PR id exists in linkedIssues
          if (linkedIssueMap.has(pullRequestId)) {
            const linkedIssueId = linkedIssueMap.get(pullRequestId)!;
            const linkedIssue = await updateLinkedIssue({
              linkedIssueId,
              sourceData,
            });

            logger.log(`Updated linked issue: linkedIssue=${linkedIssue.id}`);

            const teamId = linkedIssue.issue.team.id;
            // Updating ticket state to closed when only one PR left
            if (openPRs.length <= 1 && sourceData.mergedAt) {
              const stateId = await getState('closed', teamId);
              if (stateId) {
                await updateIssue({
                  issueId: linkedIssue.issueId,
                  teamId,
                  stateId,
                  sourceMetadata: {
                    id: integrationAccount.id,
                    type: integrationAccount.integrationDefinition.slug,
                    userDisplayName: sender.login,
                  },
                });

                logger.log(
                  `Updated issue state to closed: issueId=${linkedIssue.issueId}`,
                );
              }
            }

            return linkedIssue;
          }

          logger.debug(
            `No matching linked issue found for pull request ${pullRequestId}`,
          );
          return undefined;
        }),
      );
    }

    default:
      logger.debug(`Unhandled pull request action: ${action}`);
      return undefined;
  }
};
