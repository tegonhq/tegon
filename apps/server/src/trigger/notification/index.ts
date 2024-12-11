import { ActionEventPayload } from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { emailHandler } from './handlers/email-handler';
import { slackHandler } from './handlers/slack-handler';
import { tegonHandler } from './handlers/tegon-handler';

export async function run(eventPayload: ActionEventPayload) {
  const [slackResponse, tegonResponse] = await Promise.all([
    slackHandler(eventPayload),
    tegonHandler(eventPayload),
    emailHandler(eventPayload),
  ]);
  return { slackResponse, tegonResponse };
}

export const notificationHandler = task({ id: 'notification', run });
