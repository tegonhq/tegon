import { Button } from '@tegonhq/ui/components/button';
import { Separator } from '@tegonhq/ui/components/separator';
import { AI } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { useCommonStore } from 'hooks/use-common-store';

interface HeaderLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const HeaderLayout = observer(
  ({ children, actions }: HeaderLayoutProps) => {
    const commonStore = useCommonStore();

    return (
      <header className="flex px-4 w-full items-center">
        <div className="flex justify-between w-full py-2.5 h-[48px] items-center">
          <div className="flex gap-1 items-center">{children}</div>
          <div className="flex h-full items-center gap-1">
            {actions && (
              <>
                <div className="flex items-center">{actions}</div>
                <Separator orientation="vertical" className="h-full" />
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              isActive={commonStore.chatOpen}
              className="ml-0.5"
              onClick={() =>
                commonStore.update({ chatOpen: !commonStore.chatOpen })
              }
            >
              <AI />
            </Button>
          </div>
        </div>
      </header>
    );
  },
);
