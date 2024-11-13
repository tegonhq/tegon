import { PriorityType } from '@tegonhq/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@tegonhq/ui/components/select';
import { observer } from 'mobx-react-lite';

import { SettingSection } from 'modules/settings/setting-section';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useUpdateWorkspacePreferencesMutation } from 'services/workspace';

export const Preferences = observer(() => {
  const workspace = useCurrentWorkspace();

  const { mutate: updateWorkspacePreferences } =
    useUpdateWorkspacePreferencesMutation({});
  const onValueChange = (value: string) => {
    updateWorkspacePreferences({
      priorityType: value as PriorityType,
    });
  };

  return (
    <SettingSection
      title="Team preferences"
      description="Manage your team preferences"
    >
      <div className="flex flex-col">
        <h3 className="text-lg"> Priority preference </h3>
        <p className="text-muted-foreground">
          With your teams preferred priority settings, you can automatically
          assign issue priorities such as High, Medium, Low, or Urgent based on
          your defined rules.
        </p>

        <div className="flex gap-1 max-w-[500px] mt-2">
          <Select
            onValueChange={onValueChange}
            defaultValue={
              workspace.preferences?.priorityType ??
              PriorityType.DescriptivePriority
            }
          >
            <SelectTrigger className="flex gap-1 items-center">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                key={PriorityType.DescriptivePriority}
                value={PriorityType.DescriptivePriority}
              >
                Description (Urgent, High, Medium, Low)
              </SelectItem>
              <SelectItem
                key={PriorityType.ShorthandPriority}
                value={PriorityType.ShorthandPriority}
              >
                Shorthand (P0, P1, P2)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingSection>
  );
});
