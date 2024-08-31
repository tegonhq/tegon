import { ActionEventPayload } from '@tegonhq/sdk';
import { bugSuggestion } from 'triggers/bug-suggestions';
export async function run(eventPayload: ActionEventPayload) {
  return await bugSuggestion(eventPayload);
}
