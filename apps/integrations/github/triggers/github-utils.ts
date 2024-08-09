import {
  CreateLinkIssueInput,
  IntegrationAccount,
  LinkIssuePayload,
} from "@tegonhq/types";

import jwt from "jsonwebtoken";

import { githubHeaders } from "./github-types";
import { getRequest, postRequest } from "../../integration.utils";
import { logger } from "@trigger.dev/sdk/v3";

export function getGithubHeaders(token: string) {
  return {
    headers: {
      ...githubHeaders,
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getBotJWTToken(integrationAccount: IntegrationAccount) {
  // TODO(Manoj): Fix definition spec type
  const spec = integrationAccount.integrationDefinition.spec as any;
  const appId = spec.other_data.app_id;

  // Read private key synchronously to avoid unnecessary async operation
  const privateKey = process.env[`GITHUB_${appId}_KEY`];

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // issued at time, 60 seconds in the past to allow for clock drift
    exp: now + 600, // JWT expiration time (10 minutes)
    iss: appId, // GitHub App's identifier
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}

export async function getBotAccessToken(
  integrationAccount: IntegrationAccount,
  accesstoken: string
) {
  let config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;

  const currentTime = Date.now();

  // Get the expiration timestamp from the configuration, or set it to 0 if not available
  const expiresAt = config.expires_at
    ? new Date(config.expires_at).getTime()
    : 0;

  // If the access token is missing or has expired
  if (!config.access_token || currentTime > expiresAt) {
    // Get a new bot JWT token
    const token = await getBotJWTToken(integrationAccount);

    // Construct the URL to request a new access token
    const url = `https://api.github.com/app/installations/${integrationAccount.accountId}/access_tokens`;

    const { data: accessResponse } = await postRequest(
      url,
      getGithubHeaders(token),
      {}
    );

    // Prepare the updated configuration with the new access token and expiration timestamp
    config = {
      access_token: accessResponse.token,
      expires_at: accessResponse.expires_at,
    };

    // Update the integration account with the new configuration in the database
    await postRequest(
      `${process.env.BACKEND_HOST}/v1/integration_account/${integrationAccount}`,
      { headers: { Authorization: accesstoken } },
      { integrationConfiguration: config }
    );
  }

  return config.access_token;
}

export async function getAccessToken(
  integrationAccount: IntegrationAccount,
  accesstoken: string
) {
  // Get the integration configuration as a Record<string, string>
  const config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  // Get the current timestamp
  const currentDate = Date.now();
  // Get the access token expiration timestamp
  const accessExpiresIn = Number(config.access_expires_in);

  // If the access token is expired or not set
  if (!accessExpiresIn || currentDate >= accessExpiresIn) {
    // Get the client ID, client secret, and refresh token from the configuration
    const { client_id, client_secret, refresh_token } = config;
    const url = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`;

    // Send a POST request to refresh the access token
    const data = (await postRequest(url, { headers: {} }, {})).data;
    // Parse the response data as URL search params
    const tokens = new URLSearchParams(data);

    // Get the new access token expiration time in milliseconds
    const expiresIn = Number(tokens.get("expires_in")) * 1000;
    // Get the new refresh token expiration time in milliseconds
    const refreshExpiresIn =
      Number(tokens.get("refresh_token_expires_in")) * 1000;

    // Update the configuration with the new refresh token, access token, and expiration times
    config.refresh_token = tokens.get("refresh_token");
    config.access_token = tokens.get("access_token");
    config.access_expires_in = (currentDate + expiresIn).toString();
    config.refresh_expires_in = (currentDate + refreshExpiresIn).toString();

    // Update the integration account in the database with the new configuration
    // Update the integration account with the new configuration in the database
    await postRequest(
      `${process.env.BACKEND_HOST}/v1/integration_account/${integrationAccount}`,
      { headers: { Authorization: accesstoken } },
      { integrationConfiguration: config }
    );
  }

  // Return the access token
  return config.access_token;
}

export function convertToAPIUrl(linkData: LinkIssuePayload): string {
  const { url, type } = linkData;

  if (type === "GithubIssue" || type === "GithubPullRequest") {
    const matches = url.match(
      /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)$/
    );

    if (matches) {
      const [, owner, repo, issueOrPull, number] = matches;
      return `https://api.github.com/repos/${owner}/${repo}/${issueOrPull === "pull" ? "pulls" : "issues"}/${number}`;
    }
  }

  return url;
}

export async function sendGithubComment(
  apiUrl: string,
  githubAccesstoken: string,
  body: string
) {
  const url = `${apiUrl}/comments`;
  const headers = getGithubHeaders(githubAccesstoken);

  return postRequest(url, headers, { body });
}

export async function createLinkIssueComment(
  linkIssueInput: CreateLinkIssueInput,
  issueId: string,
  issueTitle: string,
  accesstoken: string
) {
  // Generate the comment body with the Slack channel name
  const commentBody = `Github thread in #${issueTitle}`;
  const issueComment =
    (
      await postRequest(
        `${process.env.BACKEND_HOST}/v1/issue_comments?issueId=${issueId}`,
        { headers: { Authorization: accesstoken } },
        { body: commentBody, sourceMetadata: linkIssueInput.source }
      )
    ).data || null;
  logger.info("Issue comment created successfully", { issueComment });

  linkIssueInput.source.syncedCommentId = issueComment.id;

  return await postRequest(
    `${process.env.BACKEND_HOST}/v1/linked_issues/source/${linkIssueInput.sourceId}`,
    { headers: { Authorization: accesstoken } },
    {
      sourceData: linkIssueInput.sourceData,
      source: linkIssueInput.source,
    }
  );
}

export async function getGithubUser(token: string) {
  return (
    (await getRequest("https://api.github.com/user", getGithubHeaders(token)))
      .data ?? {}
  );
}
