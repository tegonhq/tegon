import { PrismaClient } from '@prisma/client';
import { ActionEventPayload } from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { subscriptionHandler } from './subscription-handler';

const prisma = new PrismaClient();
export async function run(eventPayload: ActionEventPayload) {
  const webhooks = await prisma.webhookSubscription.findMany({
    where: { workspaceId: eventPayload.workspaceId },
  });
  await Promise.all(
    webhooks.map((webhook) =>
      subscriptionHandler({
        ...eventPayload,
        webhook,
      }),
    ),
  );
  return { eventPayload };
}

export const eventSubscriptionHandler = task({
  id: 'webhook-subscription',
  run,
});
