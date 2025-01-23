import dynamic from 'next/dynamic';

export * from './issue-status-dropdown';
export * from './issue-status-dropdown-content';

export const LazyIssueStatusDropdown = dynamic(
  () =>
    import('./issue-status-dropdown').then((mod) => mod.IssueStatusDropdown),
  {
    suspense: true,
  },
);
