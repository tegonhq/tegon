import {
  IntegrationInternalInput,
  InternalActionTypeEnum,
} from "@tegonhq/types";
import { task, tasks } from "@trigger.dev/sdk/v3";
import { twoWaySyncModels } from "./slack-types";

export const slackInternal = task({
  id: "slack-internal",
  run: async (payload: IntegrationInternalInput) => {
    const { modelName, actionType } = payload;

    switch (actionType) {
      case InternalActionTypeEnum.TwoWaySync:
        if (twoWaySyncModels.has(modelName)) {
          return await tasks.trigger(
            `slack-${modelName}-two-way-sync`,
            payload
          );
        }
        return {
          message: `There is no trigger for this model ${modelName} and action ${actionType}`,
        };

      default:
        return {
          message: `This action type is not handled in slack-internal ${actionType}`,
        };
    }
  },
});
