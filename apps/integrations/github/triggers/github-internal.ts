import {
  IntegrationInternalInput,
  InternalActionTypeEnum,
} from "@tegonhq/types";
import { task, tasks } from "@trigger.dev/sdk/v3";

export const githubInternal = task({
  id: "github-internal",
  run: async (payload: IntegrationInternalInput) => {
    switch (payload.actionType) {
      case InternalActionTypeEnum.LinkIssue:
        return await tasks.trigger(`github-link-issue`, payload);

      case InternalActionTypeEnum.IntegrationSettings:
        return await tasks.trigger(`github-integration-settings`, payload);

      default:
        return {
          message: `This action type is not handled in github-internal ${payload.actionType}`,
        };
    }
  },
});
