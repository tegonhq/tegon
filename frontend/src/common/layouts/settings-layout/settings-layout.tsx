/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AllProviders } from 'common/wrappers/all-providers';

import { SidebarNav } from './sidebar-nav';

interface SettingsProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsProps) {
  return (
    <AllProviders>
      <div className="h-[100vh] w-[100vw] flex font-sans">
        <div className="min-w-[234px]">
          <SidebarNav />
        </div>

        {children}
      </div>
    </AllProviders>
  );
}
