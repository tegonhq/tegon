import { UserTypeEnum } from '@tegonhq/types';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useConversationHistory } from 'hooks/conversations';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useStreamConversationMutation } from 'services/conversations';

export const AIConversation = observer(() => {
  const conversationHistory = useConversationHistory(
    '8c554222-44db-48c6-adc8-6d7716ac0f3a',
  );
  const workspace = useCurrentWorkspace();
  const { mutate: streamConversation } = useStreamConversationMutation();

  React.useEffect(() => {
    const lastConversation =
      conversationHistory[conversationHistory.length - 1];

    if (lastConversation.userType === UserTypeEnum.User) {
      streamConversation({
        conversationId: '8c554222-44db-48c6-adc8-6d7716ac0f3a',
        conversationHistoryId: '5491bf79-d62f-4feb-a3ec-a931d18c7010',
        workspaceId: workspace.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div></div>;
});
