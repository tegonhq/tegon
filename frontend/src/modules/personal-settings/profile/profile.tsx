/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Separator } from 'components/ui/separator';

import { ProfileForm } from './profile-form';

export function Profile() {
  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Profile </h2>
        <p className="text-sm text-muted-foreground">
          Manage your tegon profile
        </p>
      </div>

      <Separator className="my-4" />

      <ProfileForm />
    </div>
  );
}
