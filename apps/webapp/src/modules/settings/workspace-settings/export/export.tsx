import { Button } from '@tegonhq/ui/components/button';

import { SettingSection } from 'modules/settings/setting-section';

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
