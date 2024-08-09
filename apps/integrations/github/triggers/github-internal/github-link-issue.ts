import {
  CreateLinkIssueInput,
  IntegrationAccount,
  IntegrationInternalInput,
  LinkedIssue,
  LinkIssuePayload,
} from "@tegonhq/types";
import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk/v3";
import { githubIssueRegex, githubPRRegex } from "../github-types";
import { getRequest, postRequest } from "../../../integration.utils";
import {
  convertToAPIUrl,
  createLinkIssueComment,
  getBotAccessToken,
  getGithubHeaders,
  sendGithubComment,
} from "../github-utils";

export const githubLinkIssue = task({
  id: "github-link-issue",
  run: async (payload: IntegrationInternalInput) => {
    logger.log(`Received payload: ${payload}`);
    const { payload: linkIssuePayload, accesstoken } = payload;
    const { url, userId, issueId, type, subType } =
      linkIssuePayload as LinkIssuePayload;

    // Check if the type is GithubPullRequest
    const isGithubPR = subType === "GithubPullRequest";
    logger.log(`Is GitHub PR: ${isGithubPR}`);

    // Match the url against the githubPRRegex or githubIssueRegex based on isGithubPR
    const githubUrlMatch = url.match(
      isGithubPR ? githubPRRegex : githubIssueRegex
    );

    if (!githubUrlMatch) {
      throw new AbortTaskRunError("Github link didn't match with link regex");
    }
    // Extract the repository from the githubUrlMatch
    const [, repository] = githubUrlMatch;

    // Fetch the integration account settings for the repository
    const integrationAccount: IntegrationAccount = (
      await getRequest(
        `${process.env.BACKEND_HOST}/v1/integration_account/settings?path=${["Github", "repositories"]}&searchArray=[{fullName: ${repository}}]`,
        { headers: { authorization: accesstoken } }
      )
    ).data;

    // Initialize the linkIssueData with default values
    let linkIssueData: CreateLinkIssueInput = {
      url,
      issueId,
      createdById: userId,
      source: { type: "ExternalLink" },
      sourceData: { title: `Github ${isGithubPR ? "PR" : "Issue"}` },
    };
    logger.debug(`Initial link issue data: ${linkIssueData}`);

    // If integration account exists
    if (integrationAccount) {
      // Get the Github access token for the integration account
      const githubAccessToken = await getBotAccessToken(
        integrationAccount,
        accesstoken
      );

      // Fetch the issue or PR data from the Github API
      const response =
        (
          await getRequest(
            convertToAPIUrl(linkIssuePayload as LinkIssuePayload),
            getGithubHeaders(githubAccessToken)
          )
        ).data ?? {};

      // If response exists, update the linkIssueData with the fetched data
      if (response) {
        linkIssueData.sourceId = response.id.toString();
        linkIssueData.sourceData = isGithubPR
          ? {
              branch: response.head.ref,
              id: response.id.toString(),
              closedAt: response.closed_at,
              createdAt: response.created_at,
              updatedAt: response.updated_at,
              number: response.number,
              state: response.state,
              title: response.title,
              apiUrl: response.url,
              mergedAt: response.merged_at,
            }
          : {
              id: response.id.toString(),
              title: response.title,
              apiUrl: response.url,
            };

        linkIssueData.source = isGithubPR
          ? {
              type,
              subType,
              pullRequestId: response.id,
            }
          : {
              type,
              subType,
            };
      }

      // Create the linked issue
      const linkedIssue: LinkedIssue = (
        await postRequest(
          `${process.env.BACKEND_HOST}/v1/linked_issues`,
          { headers: { Authorization: accesstoken } },
          linkIssueData
        )
      ).data;

      logger.log(`Linked issue created: ${linkedIssue.id}`);
      // Destructure the required data from the linkedIssue
      const {
        issue: {
          id: issueId,
          number: issueNumber,
          title: issueTitle,
          team: { identifier: teamIdentifier },
        },
      } = linkedIssue;

      // Construct the Github comment body
      const githubCommentBody = `[${teamIdentifier}-${issueNumber} ${issueTitle}](${process.env.PUBLIC_FRONTEND_HOST}/${integrationAccount.workspace.slug}/issue/${teamIdentifier}-${issueNumber})`;

      // Send the Github comment
      await sendGithubComment(
        linkIssueData.source.apiUrl,
        githubAccessToken,
        githubCommentBody
      );
      logger.log("GitHub comment sent");

      // Create the issue comment and update link issue with synced comment
      await createLinkIssueComment(
        linkIssueData,
        issueId,
        issueTitle,
        accesstoken
      );
      logger.log("Link issue comment created");

      return linkedIssue;
    }

    // If integration account doesn't exist, create the linked issue as an External Link
    return (
      await postRequest(
        `${process.env.BACKEND_HOST}/v1/linked_issues`,
        { headers: { Authorization: accesstoken } },
        linkIssueData
      )
    ).data;
  },
});
