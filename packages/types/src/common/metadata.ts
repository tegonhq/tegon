export class SourceMetadata {
  integrationAccountId: string;
  userDisplayName?: string;
  // Integration type (slack | github)
  type: string;

  // Ex: channelId for slack
  identifier?: string;
}
