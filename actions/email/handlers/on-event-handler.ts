import { ActionEventPayload } from '@tegonhq/sdk';
import { emailTriage } from 'triggers/triage';

export const onEventHandler = async (payload: ActionEventPayload) => {
  const { eventBody, integrationAccounts, action } = payload;

  const integrationAccount = integrationAccounts.email;

  await emailTriage(eventBody, integrationAccount, action);

  return { status: 200 };
};
