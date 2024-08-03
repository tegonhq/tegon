import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const helloWorldTask1 = task({
  id: "slack-thread",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: any, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: "Hello, world!",
    };
  },
});
