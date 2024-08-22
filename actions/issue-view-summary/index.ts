import { ActionEventPayload } from '@tegonhq/sdk';
import { viewSummary } from 'triggers/view-summary';

export async function run(eventPayload: ActionEventPayload) {
  return await viewSummary(eventPayload);
}
