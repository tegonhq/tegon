import { Button } from '@tegonhq/ui/components/button';
import { BoardLine, ListLine } from '@tegonhq/ui/icons';
import { Grid3X3 } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { TooltipWrapper } from 'common/wrappers/tooltip-wrapper';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

export const LayoutSwitch = observer(() => {
  const { applicationStore } = useContextStore();

  const updateView = (view: ViewEnum) => {
    applicationStore.updateDisplaySettings({ view });
  };

  return (
    <div className="flex bg-grayAlpha-200 rounded p-0.5 h-7 items-center">
      <TooltipWrapper tooltip="List View">
        <Button
          variant="link"
          isActive={applicationStore.displaySettings.view === ViewEnum.list}
          onClick={() => updateView(ViewEnum.list)}
          className="rounded-sm py-1 px-2 h-6"
        >
          <ListLine size={20} />
        </Button>
      </TooltipWrapper>

      <TooltipWrapper tooltip="Kanban View">
        <Button
          onClick={() => updateView(ViewEnum.board)}
          variant="link"
          isActive={applicationStore.displaySettings.view === ViewEnum.board}
          className="rounded-sm py-1 px-2 h-6"
        >
          <BoardLine size={20} />
        </Button>
      </TooltipWrapper>

      <TooltipWrapper tooltip="Spreadsheet View">
        <Button
          onClick={() => updateView(ViewEnum.sheet)}
          variant="link"
          isActive={applicationStore.displaySettings.view === ViewEnum.sheet}
          className="rounded-sm py-1 px-2 h-6"
        >
          <Grid3X3 size={16} />
        </Button>
      </TooltipWrapper>
    </div>
  );
});
