/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface LinkItem {
  title: string;
  href: string;
}

export const WORKSPACE_LINKS: LinkItem[] = [
  {
    title: 'Overview',
    href: 'overview',
  },
  {
    title: 'Labels',
    href: 'labels',
  },
  {
    title: 'Members',
    href: 'members',
  },
  {
    title: 'Integrations',
    href: 'integrations',
  },
  {
    title: 'Export',
    href: 'export',
  },
];

export const ACCOUNT_LINKS: LinkItem[] = [
  {
    title: 'Profile',
    href: 'profile',
  },
  {
    title: 'Security',
    href: 'security',
  },
  {
    title: 'Preferences',
    href: 'preferences',
  },
];

export const TEAM_LINKS: LinkItem[] = [
  {
    title: 'Overview',
    href: 'overview',
  },
  {
    title: 'Members',
    href: 'members',
  },
  {
    title: 'Workflow',
    href: 'workflow',
  },
  {
    title: 'Labels',
    href: 'labels',
  },
];
