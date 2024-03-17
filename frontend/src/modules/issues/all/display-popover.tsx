/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiEqualizerFill } from '@remixicon/react';
import { observer } from 'mobx-react-lite';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Switch } from 'components/ui/switch';

import { useContextStore } from 'store/global-context-provider';

export const DisplayPopover = observer(() => {
  const { applicationStore } = useContextStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="xs" variant="outline" className="text-xs">
          <RiEqualizerFill size={14} className="mr-2 text-muted-foreground" />
          Display
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs items-center">
            <div className="text-muted-foreground min-w-[150px]"> Grouping</div>
            <div>
              <Select
                value={applicationStore.displaySettings.grouping}
                onValueChange={(value: string) => {
                  applicationStore.updateDisplaySettings({ grouping: value });
                }}
              >
                <SelectTrigger className="w-[120px] h-[25px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                  <SelectGroup>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="assignee">Assignee</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between text-xs items-center">
            <div className="text-muted-foreground min-w-[150px]">
              Show sub-issues
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showSubIssues"
                  checked={applicationStore.displaySettings.showSubIssues}
                  onCheckedChange={(value: boolean) =>
                    applicationStore.updateDisplaySettings({
                      showSubIssues: value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between text-xs items-center">
            <div className="text-muted-foreground min-w-[150px]">
              Show empty groups
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Switch
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
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
