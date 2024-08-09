import {
  IntegrationAccountSettingsPayload,
  IntegrationInternalInput,
} from "@tegonhq/types";
import { task } from "@trigger.dev/sdk/v3";
import { postRequest } from "../../../integration.utils";
import { SentryIntegrationSettings } from "../sentry-types";

export const githubIntegrationSettings = task({
  id: "github-integration-settings",
  run: async (payload: IntegrationInternalInput) => {
    const { integrationAccount, accesstoken } = payload;

    const sentryPayload = payload.payload as IntegrationAccountSettingsPayload;

    const settings: SentryIntegrationSettings = {
      orgSlug: sentryPayload.settingsData.orgSlug,
    };
    // Update the integration account with the new configuration in the database
    await postRequest(
      `${process.env.BACKEND_HOST}/v1/integration_account/${integrationAccount.id}`,
      { headers: { Authorization: accesstoken } },
      { settings }
    );

    return {
      message: `Updated settings for the integration account id ${integrationAccount.id}`,
    };
  },
});
