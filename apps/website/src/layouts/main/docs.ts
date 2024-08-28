export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface DocsConfig {
  mainNav: MainNavItem[];

  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: 'Actions',
      href: '/actions',
    },
    {
      title: 'Documentation',
      href: '/docs',
    },
    {
      title: 'Releases',
      href: '/releases',
    },
    {
      title: 'Company',
      href: '/company',
    },
  ],
  sidebarNav: [],
};
