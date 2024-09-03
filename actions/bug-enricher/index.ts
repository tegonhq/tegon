import { ActionEventPayload } from '@tegonhq/sdk';
import { bugEnricher } from 'triggers/bug-enricher';
export async function run(eventPayload: ActionEventPayload) {
  return await bugEnricher(eventPayload);
}
