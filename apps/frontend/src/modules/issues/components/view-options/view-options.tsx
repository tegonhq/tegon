import { observer } from 'mobx-react-lite';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { SettingsLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { ViewOptionItem } from './view-option-item';

export const ViewOptions = observer(() => {
  const { applicationStore } = useContextStore();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            <SettingsLine size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          <div className="w-full">
            <div className="flex flex-col gap-2 p-3">
              <h4 className="text-sm">Display settings</h4>
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
                text="Show triage issues"
                id="showTriageIssues"
                checked={applicationStore.displaySettings.showTriageIssues}
                onCheckedChange={(value: boolean) =>
                  applicationStore.updateDisplaySettings({
                    showTriageIssues: value,
                  })
                }
              />

              <ViewOptionItem
                text="Show completed issues"
                id="showCompletedIssues"
                checked={applicationStore.displaySettings.showCompletedIssues}
                onCheckedChange={(value: boolean) =>
                  applicationStore.updateDisplaySettings({
                    showCompletedIssues: value,
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
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
});
