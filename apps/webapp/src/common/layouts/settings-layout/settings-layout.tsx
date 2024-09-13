import { observer } from 'mobx-react-lite';

import { AllProviders } from 'common/wrappers/all-providers';

import { useContextStore } from 'store/global-context-provider';

import { SidebarNav } from './sidebar-nav';

interface SettingsProps {
  children: React.ReactNode;
}

export const SettingsLayout = observer(({ children }: SettingsProps) => {
  const { applicationStore } = useContextStore();

  return (
    <AllProviders>
      <div className="h-[100vh] w-[100vw] flex">
        {!applicationStore.sidebarCollapsed && (
          <div className="min-w-[234px]">
            <SidebarNav />
          </div>
        )}

        {children}
      </div>
    </AllProviders>
  );
});
