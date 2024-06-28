/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { SettingSection } from 'modules/settings/setting-section';

import { Button } from 'components/ui/button';
import { useCurrentWorkspace } from 'hooks/workspace';

export function Export() {
  const workspace = useCurrentWorkspace();

  return (
    <SettingSection
      title="Export"
      description="Export your issue data in CSV format."
    >
      <Button
        variant="secondary"
        onClick={() => {
          window.open(
            `/api/v1/issues/export?workspaceId=${workspace.id}`,
            '_blank',
          );
        }}
      >
        Export CSV
      </Button>
    </SettingSection>
  );
}
