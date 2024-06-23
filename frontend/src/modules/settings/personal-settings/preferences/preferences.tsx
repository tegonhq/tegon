/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useTheme } from 'next-themes';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Separator } from 'components/ui/separator';

export function Preferences() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Preferences </h2>
        <p className="text-sm text-muted-foreground">Manage your preferences</p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col">
        <h3 className="text-base mb-2"> Theme </h3>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <div> Interface theme </div>
          <div className="text-muted-foreground">
            Select or customise your interface color scheme.
          </div>
        </div>

        <div>
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
        </div>
      </div>
    </div>
  );
}
