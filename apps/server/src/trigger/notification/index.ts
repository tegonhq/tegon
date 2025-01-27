import { ActionEventPayload } from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

// import { emailHandler } from './handlers/email-handler';
import { emailHandler } from './handlers/email-handler';
import { slackHandler } from './handlers/slack-handler';
import { tegonHandler } from './handlers/tegon-handler';
import { whatsappHandler } from './handlers/whatsapp-handler';

export async function run(eventPayload: ActionEventPayload) {
  const [slackResponse, tegonResponse] = await Promise.all([
    slackHandler(eventPayload),
    tegonHandler(eventPayload),
    emailHandler(eventPayload),
    whatsappHandler(eventPayload),
  ]);
  return { slackResponse, tegonResponse };
}

export const notificationHandler = task({ id: 'notification', run });
