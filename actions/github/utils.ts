import {
  createIssueComment,
  getTeamById,
  getWorkflowsByTeam,
  Issue,
  logger,
  updateLinkedIssue,
  updateLinkedIssueBySource,
  UpdateLinkedIssueDto,
} from '@tegonhq/sdk';
import axios from 'axios';

export function getGithubHeaders(token: string) {
  return {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function sendGithubComment(
  url: string,
  accessToken: string,
  body: string,
) {
  const headers = getGithubHeaders(accessToken);
  return (await axios.post(url, { body }, headers)).data;
}

export async function createLinkIssueComment(
  linkIssueInput: UpdateLinkedIssueDto,
  issue: Issue,
  repoName: string,
  githubCommentUrl: string,
  accessToken: string,
  // TODO: Update this type to be more specific than `any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceMetadata?: any,
  linkedIssueId?: string,
) {
  const team = await getTeamById({ teamId: issue.teamId });
  // Create the GitHub comment body with a link to the issue
  const githubCommentBody = `[${team.identifier}-${issue.number} ${issue.title}](https://app.tegon.ai/${team.workspace.slug}/issue/${team.identifier}-${issue.number})`;

  // Send the comment to GitHub
  const commentResponse = await sendGithubComment(
    githubCommentUrl,
    accessToken,
    githubCommentBody,
  );

  const commentBody = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: `Thread of issue #${linkIssueInput.sourceData.issueNumber} in ${repoName} is connected`,
          },
        ],
      },
    ],
  };
  // Merge provided metadata with message-specific details
  const commentSourceMetadata = {
    ...sourceMetadata,
    id: commentResponse.id,
    type: linkIssueInput.sourceData.type,
    url: commentResponse.url,
    commentApiUrl: githubCommentUrl,
  };

  // Post the comment to the backend and capture the response
  const issueComment = await createIssueComment({
    issueId: issue.id,
    body: JSON.stringify(commentBody),
    sourceMetadata: commentSourceMetadata,
  });

  // Log the successful creation of the issue comment
  logger.info('Issue comment created successfully', { issueComment });

  // Update the linked issue input with the new comment ID and message timestamp
  linkIssueInput.sourceData.syncedCommentId = issueComment.id;

  logger.info('Updating Linked issue');
  // Update the linked issue source with the new data
  if (!linkedIssueId) {
    return await updateLinkedIssueBySource({
      sourceId: linkIssueInput.sourceId,
      sourceData: linkIssueInput.sourceData,
    });
  }

  return await updateLinkedIssue({
    linkedIssueId,
    url: linkIssueInput.url,
    sourceId: linkIssueInput.sourceId,
    sourceData: linkIssueInput.sourceData,
  });
}

export async function getState(
  action: string,
  teamId: string,
): Promise<string> {
  // Determine the workflow category based on the GitHub action
  const category =
    action === 'opened' || action === 'reopened'
      ? 'TRIAGE'
      : action === 'closed'
        ? 'COMPLETED'
        : null;

  if (!category) {
    return undefined;
  }

  const workflows = await getWorkflowsByTeam({ teamId });
  const workflow = workflows.find((w) => w.category === category);

  return workflow?.id;
}

export function convertToAPIUrl(url: string): string {
  const matches = url.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)$/,
  );

  if (matches) {
    const [, owner, repo, issueOrPull, number] = matches;
    return `https://api.github.com/repos/${owner}/${repo}/${issueOrPull === 'pull' ? 'pulls' : 'issues'}/${number}`;
  }

  return url;
}
