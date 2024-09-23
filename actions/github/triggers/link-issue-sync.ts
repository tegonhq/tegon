import {
  ActionEventPayload,
  ActionTypesEnum,
  getLinkedIssue,
  getLinkedIssueBySource,
  getTeamById,
  getUsers,
  JsonObject,
  logger,
  RoleEnum,
} from '@tegonhq/sdk';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
  convertToAPIUrl,
  createLinkIssueComment,
  getGithubHeaders,
} from 'utils';

export const linkIssueSync = async (actionPayload: ActionEventPayload) => {
  switch (actionPayload.event) {
    case ActionTypesEnum.ON_CREATE:
      return await onCreateLinkedIssue(actionPayload);

    case ActionTypesEnum.ON_UPDATE:
      return await onUpdateLinkedIssue(actionPayload);

    default:
      return {
        message: `This event ${actionPayload.event} is not handled in LinkedIssue Sync`,
      };
  }
};

async function onCreateLinkedIssue(actionPayload: ActionEventPayload) {
  const {
    integrationAccounts: { github: integrationAccount },
    modelId: linkIssueId,
  } = actionPayload;

  const linkedIssue = await getLinkedIssue({ linkedIssueId: linkIssueId });

  const userRole = (
    await getUsers({
      userIds: [linkedIssue.updatedById],
      workspaceId: integrationAccount.workspaceId,
    })
  )[0].role;

  if (userRole === RoleEnum.BOT) {
    return {
      message: `Ignoring comment created from Bot`,
    };
  }

  const { botToken } = integrationAccount.integrationConfiguration;

  const githubIssueRegex =
    /^https:\/\/github\.com\/(?<repository>[^/]+\/[^/]+)\/issues\/\d+$/;

  const githubPRRegex =
    /^https:\/\/github\.com\/(?<repository>[^/]+\/[^/]+)\/pull\/\d+$/;

  const githubIssueMatch = linkedIssue.url.match(githubIssueRegex);
  const githubPRMatch = linkedIssue.url.match(githubPRRegex);

  let isGithubPR = false;

  if (githubPRMatch) {
    isGithubPR = true;
  } else if (githubIssueMatch) {
    isGithubPR = false;
  } else {
    return {
      message: `Invalid GitHub URL: ${linkedIssue.url}`,
    };
  }

  const githubUrlMatch = isGithubPR ? githubPRMatch : githubIssueMatch;
  const repositoryName = githubUrlMatch?.groups?.repository;

  if (!githubUrlMatch) {
    return {
      message: `Invalid GitHub URL: ${linkedIssue.url}`,
    };
  }

  const response =
    (
      await axios.get(
        convertToAPIUrl(linkedIssue.url),
        getGithubHeaders(botToken),
      )
    ).data ?? {};

  const stateDate = response.closed_at
    ? response.closed_at
    : response.created_at;

  const sourceData: Record<string, string> = isGithubPR
    ? {
        branch: response.head.ref,
        id: response.id.toString(),
        closedAt: response.closed_at,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        issueNumber: response.number,
        state: response.state,
        title: `#${response.number} - ${response.title}    -- ${response.state} ${formatDistanceToNow(new Date(stateDate), { addSuffix: true })}`,
        apiUrl: response.url,
        commentApiUrl: response.comments_url,
        mergedAt: response.merged_at,
        displayName: response.user.login,
        githubType: 'PR',
        type: integrationAccount.integrationDefinition.slug,
      }
    : {
        id: response.id.toString(),
        issueNumber: response.number,
        title: `#${response.number} - ${response.title}`,
        apiUrl: response.url,
        htmlUrl: response.html_url,
        type: integrationAccount.integrationDefinition.slug,
        displayName: response.user.login,
        commentApiUrl: response.comments_url,
        githubType: 'ISSUE',
      };

  const team = await getTeamById({ teamId: linkedIssue.issue.teamId });

  if (!isGithubPR) {
    const linkedIssues = await getLinkedIssueBySource({
      sourceId: response.id.toString(),
    });
    // Check if there are multiple linked issues with the same sourceId
    // This can happen if the same thread is linked to multiple issues by mistake
    // We want to prevent this scenario and ensure that each thread is linked to only one issue
    // If there are multiple linked issues, return an error message
    if (linkedIssues.length > 0) {
      return { message: 'Not a PR, Ignoring to update linked issue' };
    }
  }
  const linkIssueInput = {
    url: response.html_url,
    sourceId: response.id.toString(),
    issueId: linkedIssue.issueId,
    sourceData,
    teamId: team.id,
  };
  const linkedIssues = await createLinkIssueComment(
    linkIssueInput,
    linkedIssue.issue,
    repositoryName,
    response.comments_url,
    botToken,
    sourceData,
    linkedIssue.id,
    false,
  );

  return linkedIssues;
}

async function onUpdateLinkedIssue(actionPayload: ActionEventPayload) {
  const {
    modelId: linkedIssueId,
    changedData,
    integrationAccounts: { github: integrationAccount },
  } = actionPayload;

  const { botToken } = integrationAccount.integrationConfiguration;

  if (changedData.sync !== undefined || changedData.deleted) {
    const linkedIssue = await getLinkedIssue({ linkedIssueId });

    const userRole = (
      await getUsers({
        userIds: [linkedIssue.updatedById],
        workspaceId: integrationAccount.workspaceId,
      })
    )[0].role;

    if (userRole === RoleEnum.BOT) {
      return {
        message: `Ignoring comment created from Bot`,
      };
    }

    const sourceData = linkedIssue.sourceData as JsonObject;

    const {
      issue: { team, number: issueNumber },
    } = linkedIssue;
    const { identifier: teamIdentifier } = team;

    // Create the issue identifier
    const issueIdentifier = `${teamIdentifier}-${issueNumber}`;

    // Create the issue URL using the workspace slug and issue identifier
    const issueUrl = `https://app.tegon.ai/${integrationAccount.workspace.slug}/issue/${issueIdentifier}`;

    let body = `Stopping sync with Tegon issue [${issueIdentifier}](${issueUrl})`;
    if (changedData.sync) {
      body = `This thread is syncing with a Tegon issue [${issueIdentifier}](${issueUrl})`;
    }

    await axios.post(
      `${sourceData.apiUrl}/comments`,
      { body },
      getGithubHeaders(botToken),
    );

    logger.debug(
      `Github message sent successfully for linked issue: ${issueIdentifier}`,
    );

    return { message: `Github message sent successfully` };
  }

  return { message: 'ignoring the change in linked issue' };
}
