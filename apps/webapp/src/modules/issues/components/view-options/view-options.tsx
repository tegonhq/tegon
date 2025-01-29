import { Button } from '@tegonhq/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { SettingsLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { TooltipWrapper } from 'common/wrappers/tooltip-wrapper';

import { IssueViewContext } from 'components/side-issue-view';

import { useContextStore } from 'store/global-context-provider';

import { CompletedFilter } from './completed-filter';
import { ViewOptionItem } from './view-option-item';

export const ViewOptions = observer(() => {
  const { applicationStore } = useContextStore();
  const { viewType, setViewType } = React.useContext(IssueViewContext);

  return (
    <>
      <Popover>
        <TooltipWrapper tooltip="Display Options">
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <SettingsLine size={20} />
            </Button>
          </PopoverTrigger>
        </TooltipWrapper>
        <PopoverContent className="w-52 p-0" align="end">
          <div className="w-full">
            <div className="flex flex-col p-3 pb-2">
              <h4 className="text-sm text-muted-foreground">
                Completed filter
              </h4>
              <CompletedFilter />
            </div>
            <div className="flex flex-col gap-2 p-3 pt-0">
              <h4 className="text-sm text-muted-foreground">
                Display settings
              </h4>

              <ViewOptionItem
                text="Show sub-issues"
                id="showSubIssues"
                checked={applicationStore.displaySettings.showSubIssues}
                onCheckedChange={(value: boolean) =>
                  applicationStore.updateDisplaySettings({
                    showSubIssues: value,
                  })
                }
              />

              <ViewOptionItem
                text="Show empty groups"
                id="showEmptyGroups"
                checked={applicationStore.displaySettings.showEmptyGroups}
                onCheckedChange={(value: boolean) =>
                  applicationStore.updateDisplaySettings({
                    showEmptyGroups: value,
                  })
                }
              />

              <ViewOptionItem
                text="View issue in sidebar"
                id="viewIssueInSidebar"
                checked={viewType === 'side_view'}
                onCheckedChange={(value: boolean) =>
                  setViewType(value ? 'side_view' : 'view_screen')
                }
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
});
