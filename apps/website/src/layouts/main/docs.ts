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
      href: 'https://docs.tegon.ai/actions/overview',
    },
    {
      title: 'Documentation',
      href: 'https://docs.tegon.ai',
    },
    {
      title: 'Releases',
      href: 'https://github.com/tegonhq/tegon/releases',
    },
    {
      title: 'Company',
      href: 'https://tegon.ai/company',
    },
  ],
  sidebarNav: [],
};
