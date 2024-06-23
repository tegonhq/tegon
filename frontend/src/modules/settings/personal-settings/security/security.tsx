/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { SettingSection } from 'modules/settings/setting-section';

import { SecurityForm } from './security-form';

export function Security() {
  return (
    <SettingSection title="Security" description="Change your password">
      <SecurityForm />
    </SettingSection>
  );
}
