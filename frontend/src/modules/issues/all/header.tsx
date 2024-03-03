/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Button } from 'components/ui/button';

export function Header() {
  return (
    <header className="flex pl-8 px-4 py-3 w-full border-b justify-between items-center">
      <h3 className="text-sm font-medium"> All Issues </h3>

      <div>
        <Button size="sm" variant="outline">
          Notification
        </Button>
      </div>
    </header>
  );
}
