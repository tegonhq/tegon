import {
  ActionEventPayload,
  getIssueById,
  getLabels,
  getWorkflowsByTeam,
  logger,
  updateIssue,
  WorkflowCategory,
} from '@tegonhq/sdk';
import axios from 'axios';
import {
  convertTiptapJsonToMarkdown,
  createLinkIssueComment,
  getGithubHeaders,
} from 'utils';

export const issueSync = async (actionPayload: ActionEventPayload) => {
  const {
    integrationAccounts: { github: integrationAccount },
    modelId: issueId,
    action,
    userId,
    linkedIssue,
  } = actionPayload;

  const { botToken, accessToken } = integrationAccount.integrationConfiguration;

  const issue = await getIssueById({ issueId });

  // const userRole = (
  //   await getUsers({
  //     userIds: [issue.updatedById || issue.createdById],
  //     workspaceId: integrationAccount.workspaceId,
  //   })
  // )[0].role;

  // if (userRole === RoleEnum.BOT) {
  //   return {
  //     message: `Ignoring issue created from Bot`,
  //   };
  // }

  const repoMapping = action.data.inputs.repoTeamMappings.find(
    ({ teamId: mappedTeamId }: { teamId: string }) =>
      mappedTeamId === issue.teamId,
  );

  const repoFullName = integrationAccount.settings.repositories.find(
    (repo: Record<string, string | boolean>) => repo.id === repoMapping.repo,
  )?.fullName;

  const workflows = await getWorkflowsByTeam({ teamId: issue.teamId });

  const stateCategory = workflows.find(
    (workflow) => workflow.id === issue.stateId,
  )?.category;

  // TODO(new): modify this to service
  // const assigneeGithubUserAccount = await getPersonalIntegrationAccount({
  //   workspaceId: issue.team.workspaceId,
  //   userId: issue.assigneeId,
  //   definitionSlug: integrationAccount.integrationDefinition.slug,
  // });
  const assigneeGithubUserAccount = (
    await axios.get(
      `/api/v1/integration_account/personal?workspaceId=${issue.team.workspaceId}&userId=${issue.assigneeId}&definitionSlug=${integrationAccount.integrationDefinition.slug}`,
    )
  ).data;

  const labels = await getLabels({
    workspaceId: issue.team.workspaceId,
    teamId: issue.teamId,
  });

  const issueLabels = issue.labelIds
    .map((labelId) => {
      const label = labels.find((l) => l.id === labelId);
      return label?.name;
    })
    .filter(Boolean);

  // Prepare the issue body for GitHub API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issueBody: any = {
    title: issue.title,
    ...(issue.description
      ? { body: convertTiptapJsonToMarkdown(issue.description) }
      : {}),
    labels: issueLabels,
    state:
      stateCategory === WorkflowCategory.COMPLETED ||
      stateCategory === WorkflowCategory.CANCELED
        ? 'closed'
        : 'open',
    state_reason:
      stateCategory === WorkflowCategory.COMPLETED
        ? 'completed'
        : stateCategory === WorkflowCategory.CANCELED
          ? 'not_planned'
          : null,
  };

  // Add assignee to the issue body if available
  if (assigneeGithubUserAccount) {
    issueBody.assignees = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (assigneeGithubUserAccount.settings as any).login,
    ];
  }

  if (linkedIssue) {
    // Get the access token based on user or bot integration account
    const updateAccessToken = assigneeGithubUserAccount
      ? accessToken
      : botToken;

    // Update the linked issue on GitHub
    return (
      await axios.post(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (linkedIssue.sourceData as Record<string, any>).apiUrl,
        issueBody,
        getGithubHeaders(updateAccessToken),
      )
    ).data;
  }

  const url = `https://api.github.com/repos/${repoFullName}/issues`;
  logger.log(`URL: ${url}, ${botToken}`);
  const githubIssue = (
    await axios.post(url, issueBody, getGithubHeaders(botToken))
  ).data;

  logger.log(`Created Github issue with id ${githubIssue.id}`);

  const linkIssueData = {
    url: githubIssue.html_url,
    sourceId: githubIssue.id.toString(),
    sourceData: {
      id: githubIssue.id.toString(),
      title: githubIssue.title,
      apiUrl: githubIssue.url,
      type: integrationAccount.integrationDefinition.slug,
      displayName: githubIssue.user.login,
    },
    createdById: userId,
  };

  await updateIssue({
    issueId: issue.id,
    teamId: issue.teamId,
    linkIssueData,
  });

  await createLinkIssueComment(
    linkIssueData,
    issue,
    repoFullName,
    githubIssue.url,
    botToken,
  );

  return githubIssue;
};
