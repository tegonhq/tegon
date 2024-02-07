/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Separator } from 'components/ui/separator';

export function Label() {
  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Workspace Labels </h2>
        <p className="text-sm text-muted-foreground">Manage workspace labels</p>
      </div>

      <Separator className="my-4" />
    </div>
  );
}
