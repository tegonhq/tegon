import {
  IntegrationInternalInput,
  InternalActionTypeEnum,
  TwoWaySyncPayload,
} from "@tegonhq/types";
import { task, tasks } from "@trigger.dev/sdk/v3";
import { twoWaySyncModels } from "./slack-types";

export const slackInternal = task({
  id: "slack-internal",
  run: async (payload: IntegrationInternalInput) => {
    switch (payload.actionType) {
      case InternalActionTypeEnum.TwoWaySync:
        const { modelName } = payload.payload as TwoWaySyncPayload;
        if (twoWaySyncModels.has(modelName)) {
          return await tasks.trigger(
            `slack-${modelName}-two-way-sync`,
            payload
          );
        }
        return {
          message: `There is no trigger for this model ${modelName} and action ${payload.actionType}`,
        };

      case InternalActionTypeEnum.LinkIssue:
        return await tasks.trigger(`slack-link-issue`, payload);

      case InternalActionTypeEnum.IntegrationSettings:
        return await tasks.trigger(`slack-integration-settings`, payload);

      default:
        return {
          message: `This action type is not handled in slack-internal ${payload.actionType}`,
        };
    }
  },
});
