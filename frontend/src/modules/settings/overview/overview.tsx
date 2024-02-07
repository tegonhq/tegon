/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';

export function Overview() {
  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Workspace </h2>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col">
        <h3 className="text-base mb-2"> Logo </h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input id="picture" type="file" className="hidden" />
        </div>
        <p className="text-sm text-muted-foreground">
          Pick a logo for your workspace. Recommended size is 256*256px
        </p>
      </div>
    </div>
  );
}
