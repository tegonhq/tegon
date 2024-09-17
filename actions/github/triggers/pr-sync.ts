import {
  ActionEventPayload,
  createLinkedIssue,
  getIssueByNumber,
  getLinkedIssuesByIssueId,
  getTeamByName,
  JsonObject,
  logger,
  updateIssue,
  updateLinkedIssue,
} from '@tegonhq/sdk';
import { createLinkIssueComment, getState } from 'utils';

export const prSync = async (actionPayload: ActionEventPayload) => {
  const {
    eventBody,
    integrationAccounts: { github: integrationAccount },
  } = actionPayload;

  const { botToken } = integrationAccount.integrationConfiguration;

  const { pull_request: pullRequest, action, sender } = eventBody;
  const branchName = pullRequest.head.ref;
  const branchNameRegex = /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)-(\d+)$/;
  // Checking branch name is matching with regex
  const match = branchName.match(branchNameRegex);

  logger.debug(
    `Handling pull request event: action=${action}, branchName=${branchName}`,
  );

  if (!match) {
    logger.debug(
      `Branch name ${branchName} does not match the expected format`,
    );
    return undefined;
  }

  // Extracting username, team name and issue number from the regex match
  const [, userName, teamSlug, issueNumber] = match;

  logger.debug(
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
    logger.debug(
      `User, team, or issue not found: team=${team}, issue=${issue}`,
    );
    return undefined;
  }

  const pullRequestId = pullRequest.id.toString();
  // Preparing source data for linked issue
  const sourceData = {
    branch: pullRequest.head.ref,
    id: pullRequestId,
    closedAt: pullRequest.closed_at,
    createdAt: pullRequest.created_at,
    updatedAt: pullRequest.updated_at,
    issueNumber: pullRequest.number,
    state: pullRequest.state,
    title: `#${pullRequest.number} - ${pullRequest.title}`,
    apiUrl: pullRequest.url,
    mergedAt: pullRequest.merged_at,
    githubType: 'PR',
    type: integrationAccount.integrationDefinition.slug,
  };

  const linkIssueInput = {
    url: pullRequest.html_url,
    sourceId: pullRequestId,
    issueId: issue.id,
    sourceData,
    teamId: team.id,
  };

  switch (action) {
    case 'opened': {
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
      await createLinkIssueComment(
        linkIssueInput,
        issue,
        pullRequest.base.repo.name,
        pullRequest.url,
        botToken,
        sourceData,
      );

      return linkedIssue;
    }

    case 'closed': {
      /** On closed, checking for all linked PR's, only updating status of ticket
       * when all other linked PR's are closed or only one linked PR
       * */
      const linkedIssues = await getLinkedIssuesByIssueId({
        issueId: issue.id,
      });

      const openPRs = linkedIssues.filter(
        (linkedIssue) =>
          (linkedIssue.sourceData as JsonObject).githubType === 'PR' &&
          (linkedIssue.sourceData as JsonObject).state === 'open',
      );

      const linkedIssueMap = openPRs.reduce(
        (map, linkedIssue) => map.set(linkedIssue.sourceId, linkedIssue.id),
        new Map<string, string>(),
      );

      logger.log(
        `Found ${openPRs.length} open pull requests for issue ${issue.id}`,
      );
      // Checking if the PR id exists in linkedIssues
      if (linkedIssueMap.has(pullRequestId)) {
        const linkedIssueId = linkedIssueMap.get(pullRequestId)!;
        const linkedIssue = await updateLinkedIssue({
          linkedIssueId,
          sourceData,
        });

        logger.log(`Updated linked issue: linkedIssue=${linkedIssue.id}`);

        // Updating ticket state to closed when only one PR left
        if (openPRs.length <= 1 && sourceData.mergedAt) {
          const stateId = await getState('closed', team.id);
          if (stateId) {
            await updateIssue({
              issueId: linkedIssue.issueId,
              teamId: team.id,
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
    }

    default:
      logger.debug(`Unhandled pull request action: ${action}`);
      return undefined;
  }
};
