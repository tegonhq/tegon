/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Separator } from 'components/ui/separator';

import { SecurityForm } from './security-form';

export function Security() {
  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Security </h2>
        <p className="text-sm text-muted-foreground">Change your password</p>
      </div>

      <Separator className="my-4" />

      <SecurityForm />
    </div>
  );
}
