import { SettingSection } from 'modules/settings/setting-section';

import { PersonalTokens } from './personal-tokens';

export function API() {
  return (
    <SettingSection
      title="Personal API Keys"
      description="You can create personal tokens to deploy your actions on the platform"
    >
      <PersonalTokens />
    </SettingSection>
  );
}
