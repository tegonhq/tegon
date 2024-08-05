import { ModelNameEnum, TwoWaySyncInput } from "@tegonhq/types";
import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const slackIssueTwoWay = task({
  id: `slack-${ModelNameEnum.Issue}-two-way-sync`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: TwoWaySyncInput, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: "Hello, world!",
    };
  },
});
