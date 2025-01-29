import { observer } from 'mobx-react-lite';

import { SidebarExpand } from './sidebar-expand';

interface HeaderLayoutProps {
  children: React.ReactNode;
  showExpandIcon?: boolean;
  actions?: React.ReactNode;
}

export const HeaderLayout = observer(
  ({ children, actions, showExpandIcon = true }: HeaderLayoutProps) => {
    return (
      <header className="flex px-2 w-full items-center border-b border-border">
        <div className="flex justify-between w-full py-2 h-[38px] items-center">
          <div className="flex gap-1 items-center">
            {showExpandIcon && <SidebarExpand />}

            {children}
          </div>
          <div className="flex h-full items-center gap-1">
            {actions && (
              <>
                <div className="flex items-center">{actions}</div>
              </>
            )}
          </div>
        </div>
      </header>
    );
  },
);
