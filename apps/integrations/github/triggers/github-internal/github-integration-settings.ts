import { IntegrationInternalInput } from "@tegonhq/types";
import { AbortTaskRunError, task } from "@trigger.dev/sdk/v3";
import { getRequest, postRequest } from "../../../integration.utils";
import {
  getAccessToken,
  getBotJWTToken,
  getGithubHeaders,
  getGithubUser,
} from "../github-utils";
import {
  GithubIntegrationSettings,
  GithubPersonalIntegrationSettings,
} from "../github-types";

export const githubIntegrationSettings = task({
  id: "github-integration-settings",
  run: async (payload: IntegrationInternalInput) => {
    const { integrationAccount, accesstoken } = payload;

    let settings: GithubIntegrationSettings | GithubPersonalIntegrationSettings;
    // if (integrationAccount.personal) {
    if (integrationAccount.integrationDefinition.name === "GithubPersonal") {
      const userData = await getGithubUser(
        await getAccessToken(integrationAccount, accesstoken)
      );

      settings = { login: userData.login };
    } else {
      const integrationConfig =
        integrationAccount.integrationConfiguration as any;

      const githubAccessToken = integrationConfig.access_token;

      const installationId = integrationAccount.accountId;
      const [org, repos] = await Promise.all([
        getRequest(
          `https://api.github.com/app/installations/${installationId}`,
          getGithubHeaders(await getBotJWTToken(integrationAccount))
        ).then((response) => response.data),
        getRequest(
          `https://api.github.com/user/installations/${installationId}/repositories`,
          getGithubHeaders(githubAccessToken)
        ).then((response) => response.data),
      ]);

      if (!org) {
        throw new AbortTaskRunError(
          `Couldn't get settings for the integration account id ${integrationAccount.id}`
        );
      }

      settings = {
        orgAvatarURL: org.account.avatar_url,
        orgLogin: org.account.login,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repositories: repos?.repositories.map((repo: any) => ({
          id: repo.id.toString(),
          fullName: repo.full_name,
          name: repo.name,
          private: repo.private,
        })),
        mappings: [],
      };
    }

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
