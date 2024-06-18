/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiDashboardLine, RiListCheck } from '@remixicon/react';
import { observer } from 'mobx-react-lite';

import { cn } from 'common/lib/utils';

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
import { Switch } from 'components/ui/switch';
import { SettingsLine } from 'icons';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

export const DisplayPopover = observer(() => {
  const { applicationStore } = useContextStore();

  const updateView = (view: ViewEnum) => {
    applicationStore.updateDisplaySettings({ view });
  };

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
            <div className="flex gap-2 items-center w-full p-3 justify-center"></div>
            <Separator />

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
                  Show triage issues
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showTriageIssues"
                      checked={
                        applicationStore.displaySettings.showTriageIssues
                      }
                      onCheckedChange={(value: boolean) =>
                        applicationStore.updateDisplaySettings({
                          showTriageIssues: value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs items-center">
                <div className="text-muted-foreground min-w-[150px]">
                  Show completed issues
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showCompletedIssues"
                      checked={
                        applicationStore.displaySettings.showCompletedIssues
                      }
                      onCheckedChange={(value: boolean) =>
                        applicationStore.updateDisplaySettings({
                          showCompletedIssues: value,
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
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
});
