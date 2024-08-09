import {
  IntegrationInternalInput,
  InternalActionTypeEnum,
} from "@tegonhq/types";
import { task, tasks } from "@trigger.dev/sdk/v3";

export const sentryInternal = task({
  id: "sentry-internal",
  run: async (payload: IntegrationInternalInput) => {
    switch (payload.actionType) {
      case InternalActionTypeEnum.LinkIssue:
        return await tasks.trigger(`sentry-link-issue`, payload);

      case InternalActionTypeEnum.IntegrationSettings:
        return await tasks.trigger(`sentry-integration-settings`, payload);

      default:
        return {
          message: `This action type is not handled in sentry-internal ${payload.actionType}`,
        };
    }
  },
});
