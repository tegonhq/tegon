/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { SettingSection } from 'modules/settings/setting-section';

import { ProfileForm } from './profile-form';

export function Profile() {
  return (
    <SettingSection title="Profile" description=" Manage your tegon profile">
      <ProfileForm />
    </SettingSection>
  );
}
