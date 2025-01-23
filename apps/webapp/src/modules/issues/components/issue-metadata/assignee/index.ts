import dynamic from 'next/dynamic';

export * from './issue-assignee-dropdown-content';
export * from './issue-assignee-dropdown';
export * from './issue-assignee-dropdown-without-context';

export const LazyIssueAssigneeDropdown = dynamic(
  () =>
    import('./issue-assignee-dropdown').then(
      (mod) => mod.IssueAssigneeDropdown,
    ),
  {
    suspense: true,
  },
);
