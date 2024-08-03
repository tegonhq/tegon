import { logger, task, wait } from "@trigger.dev/sdk/v3";
import { WebhookPayload } from "@tegonhq/types";

export const slackWebhook = task({
  id: "slack-webhook",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: WebhookPayload, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: "Hello, world!",
    };
  },
});
