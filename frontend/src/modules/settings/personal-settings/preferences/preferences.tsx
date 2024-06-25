/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useTheme } from 'next-themes';

import { SettingSection } from 'modules/settings/setting-section';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';

export function Preferences() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl"> Preferences </h2>
      <SettingSection
        title="Theme"
        description="Choose a preferred theme for the app."
      >
        <Select
          value={theme}
          onValueChange={(value: string) => {
            setTheme(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select your theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SettingSection>
    </div>
  );
}
