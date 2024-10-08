import {
  ActionEventPayload,
  createLinkedIssueComment,
  getIssueById,
  getIssueComment,
  getLinkedIssuesByIssueId,
  getPersonalIntegrationAccount,
  getUsers,
  RoleEnum,
} from '@tegonhq/sdk';
import axios from 'axios';
import { getGithubHeaders } from 'utils';

export const commentSync = async (actionPayload: ActionEventPayload) => {
  const {
    integrationAccounts: { github: integrationAccount },
    modelId: issueCommentId,
  } = actionPayload;

  const { botToken, accessToken } = integrationAccount.integrationConfiguration;

  const {
    integrationDefinition: { slug: integrationDefinitionSlug },
  } = integrationAccount;

  const issueComment = await getIssueComment({ issueCommentId });
  const issue = await getIssueById({ issueId: issueComment.issueId });

  const user = (
    await getUsers({
      userIds: [issueComment.updatedById],
      workspaceId: integrationAccount.workspaceId,
    })
  )[0];

  if (user.role === RoleEnum.BOT) {
    return {
      message: `Ignoring comment created from Bot`,
    };
  }

  const parentIssueComment = issueComment.parent;
  const parentSourceMetadata = parentIssueComment
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (parentIssueComment.sourceMetadata as Record<string, any>)
    : {};

  if (
    !parentIssueComment ||
    !parentSourceMetadata ||
    parentSourceMetadata.type !== integrationDefinitionSlug
  ) {
    return {
      message: 'Parent comment does not exist or has empty source metadata',
    };
  }

  const linkedIssues = await getLinkedIssuesByIssueId({
    issueId: issueComment.issueId,
  });

  const syncingLinkedIssue = linkedIssues.find((linkedIssue) => {
    const sourceData = linkedIssue.sourceData as Record<string, string>;
    return (
      sourceData.type === integrationDefinitionSlug && linkedIssue.sync === true
    );
  });

  if (!syncingLinkedIssue) {
    return { message: 'Linked issue is not sync with source' };
  }

  // Extract the source metadata from the parent issue comment
  const parentSourceData = parentIssueComment.sourceMetadata as Record<
    string,
    string
  >;

  // TODO(new): modify this to service
  const userGithubPersonalAccount = await getPersonalIntegrationAccount({
    workspaceId: issue.team.workspaceId,
    userId: issue.assigneeId,
    definitionSlug: integrationAccount.integrationDefinition.slug,
  });

  const updatedAccessToken = userGithubPersonalAccount ? accessToken : botToken;

  const body = userGithubPersonalAccount
    ? issueComment.bodyMarkdown
    : `>${user.fullname}  commented from Tegon \n\n ${issueComment.bodyMarkdown}`;

  const githubIssueComment = (
    await axios.post(
      parentSourceData.commentApiUrl,
      { body },
      getGithubHeaders(updatedAccessToken),
    )
  ).data;

  if (githubIssueComment.id) {
    const sourceData = {
      id: githubIssueComment.id,
      body: githubIssueComment.body,
      displayUserName: githubIssueComment.user.login,
      apiUrl: githubIssueComment.url,
    };

    // Create a linked comment in the database
    return await createLinkedIssueComment({
      url: githubIssueComment.url,
      sourceId: githubIssueComment.id.toString(),
      commentId: issueComment.id,
      sourceData,
    });
  }

  return null;
};
