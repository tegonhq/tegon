/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { Button } from 'components/ui/button';
import { BoardLine, ListLine } from 'icons';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

export const LayoutSwitch = observer(() => {
  const { applicationStore } = useContextStore();

  const updateView = (view: ViewEnum) => {
    applicationStore.updateDisplaySettings({ view });
  };

  return (
    <div className="flex gap-1 bg-grayAlpha-200 rounded-md p-0.5 h-7 items-center">
      <Button
        variant="ghost"
        size="sm"
        isActive={applicationStore.displaySettings.view === ViewEnum.list}
        onClick={() => updateView(ViewEnum.list)}
        className="rounded py-1 px-3 h-6"
      >
        <ListLine size={20} />
      </Button>
      <Button
        onClick={() => updateView(ViewEnum.board)}
        variant="ghost"
        isActive={applicationStore.displaySettings.view === ViewEnum.board}
        size="sm"
        className="rounded py-1 px-3 h-6"
      >
        <BoardLine size={20} />
      </Button>
    </div>
  );
});
