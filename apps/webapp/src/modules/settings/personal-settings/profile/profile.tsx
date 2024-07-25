import { SettingSection } from 'modules/settings/setting-section';

import { ProfileForm } from './profile-form';

export function Profile() {
  return (
    <SettingSection title="Profile" description=" Manage your tegon profile">
      <ProfileForm />
    </SettingSection>
  );
}
