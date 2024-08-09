import { LinkedIssue } from '@tegonhq/types';

import { IssueWithRelations } from 'modules/issues/issues.interface';

export interface LinkedIssueWithRelations extends LinkedIssue {
  issue: IssueWithRelations;
}

export const githubIssueRegex =
  /^https:\/\/github\.com\/(?<repository>[^/]+\/[^/]+)\/issues\/\d+$/;

export const githubPRRegex =
  /^https:\/\/github\.com\/(?<repository>[^/]+\/[^/]+)\/pull\/\d+$/;

// export const githubPRRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+$/;

export const slackRegex =
  /^https:\/\/(\w+)\.slack\.com\/archives\/([A-Z0-9]+)\/p(\d{10})(\d{6})(?:\?thread_ts=(\d{10}\.\d{6}))?/;

export const sentryRegex =
  /^https:\/\/(?<orgSlug>.+)\.sentry\.io\/issues\/(?<sentryIssueId>\d+)\//;
