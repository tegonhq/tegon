import React from 'react';

import { useCurrentWorkspace } from 'hooks/workspace';

interface Props {
  children: React.ReactNode;
}

export function ActionAccessGuard(props: Props): React.ReactElement {
  const { children } = props;
  const workspace = useCurrentWorkspace();

  if (workspace.actionsEnabled) {
    return <>{children}</>;
  }

  return (
    <h2 className="p-3">
      Currently Actions is in beta. Reachout to support (harshith@tegon.ai) for
      access
    </h2>
  );
}
