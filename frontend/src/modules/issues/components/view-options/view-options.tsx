/** Copyright (c) 2024, Tegon, all rights reserved. **/

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
import { Separator } from 'components/ui/separator';
import { SettingsLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { ViewOptionItem } from './view-option-item';

export const ViewOptions = observer(() => {
  const { applicationStore } = useContextStore();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <SettingsLine size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          <div className="w-full">
            <div className="flex items-center gap-2 flex-col w-full p-3">
              <div className="flex justify-between text-xs items-center w-full">
                <div className="text-muted-foreground min-w-[150px]">
                  Grouping
                </div>
                <div>
                  <Select
                    value={applicationStore.displaySettings.grouping}
                    onValueChange={(value: string) => {
                      applicationStore.updateDisplaySettings({
                        grouping: value,
                      });
                    }}
                  >
                    <SelectTrigger className="w-[100px] h-[25px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectGroup>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="assignee">Assignee</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="label">Label</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between text-xs items-center w-full">
                <div className="text-muted-foreground min-w-[150px]">
                  Ordering
                </div>
                <div>
                  <Select
                    value={applicationStore.displaySettings.ordering}
                    onValueChange={(value: string) => {
                      applicationStore.updateDisplaySettings({
                        ordering: value,
                      });
                    }}
                  >
                    <SelectTrigger className="w-[100px] h-[25px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectGroup>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="assignee">Assignee</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="updated_at">Last updated</SelectItem>
                        <SelectItem value="created_at">Last created</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Separator />
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
