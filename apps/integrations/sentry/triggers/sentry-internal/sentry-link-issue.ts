import {
  CreateLinkIssueInput,
  IntegrationAccount,
  IntegrationInternalInput,
  LinkIssuePayload,
} from "@tegonhq/types";
import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk/v3";
import { getRequest, postRequest } from "../../../integration.utils";
import { sentryRegex } from "../sentry-types";
import { getSentryIssue } from "../sentry-utils";

export const sentryLinkIssue = task({
  id: "sentry-link-issue",
  run: async (payload: IntegrationInternalInput) => {
    logger.log(`Received payload: ${payload}`);
    const { payload: linkIssuePayload, accesstoken } = payload;
    const { url, userId, issueId, type } = linkIssuePayload as LinkIssuePayload;

    const sentryMatch = url.match(sentryRegex);
    if (!sentryMatch) {
      throw new AbortTaskRunError("Sentry link didn't match with link regex");
    }

    // Initialize the linkIssueData with default values
    let linkIssueData: CreateLinkIssueInput = {
      url,
      issueId,
      createdById: userId,
      source: { type: "ExternalLink" },
      sourceData: {},
    };

    const [, orgSlug, sentryIssueId] = sentryMatch;

    // Fetch the integration account settings for the repository
    const integrationAccount: IntegrationAccount = (
      await getRequest(
        `${process.env.BACKEND_HOST}/v1/integration_account/settings?path=${["Sentry", "orgSlug"]}&searchString=${orgSlug}`,
        { headers: { authorization: accesstoken } }
      )
    ).data;

    if (integrationAccount) {
      const sentryResponse = await getSentryIssue(
        integrationAccount,
        accesstoken,
        orgSlug,
        sentryIssueId
      );

      if (sentryResponse.status === 200) {
        const sentryData = sentryResponse.data;
        linkIssueData.source = { type, syncedCommentId: null };
        linkIssueData.sourceData = {
          title: sentryData.title,
          projectId: sentryData.project.id,
          projectName: sentryData.project.name,
          type: sentryData.type,
          metadata: {
            value: sentryData.metadata.value,
            type: sentryData.metadata.type,
            filename: sentryData.metadata.filename,
          },
          firstSeen: sentryData.firstSeen,
          issueType: sentryData.issueType,
          issueCategory: sentryData.issueCategory,
        };
      }
    }

    // Create the linked issue
    return (
      await postRequest(
        `${process.env.BACKEND_HOST}/v1/linked_issues`,
        { headers: { Authorization: accesstoken } },
        linkIssueData
      )
    ).data;
  },
});
