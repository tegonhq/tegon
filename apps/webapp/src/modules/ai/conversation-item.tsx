import { UserTypeEnum } from '@tegonhq/types';
import { defaultExtensions } from '@tegonhq/ui/components/ui/editor/editor-extensions';
import { AI } from '@tegonhq/ui/icons';
import { Editor } from '@tiptap/core';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';

import type { ConversationHistoryType } from 'common/types';
import { UserAvatar } from 'common/user-avatar';

import { useUserData } from 'hooks/users';

interface AIConversationItemProps {
  conversationHistory: ConversationHistoryType;
}

export const ConversationItem = observer(
  ({ conversationHistory }: AIConversationItemProps) => {
    const { user } = useUserData(conversationHistory.userId);
    const id = `a${conversationHistory.id.replace(/-/g, '')}`;
    const editorRef = useRef<Editor | null>(null);

    useEffect(() => {
      const element = document.getElementById(id);
      let editor: Editor;

      if (element) {
        editor = new Editor({
          element,
          extensions: defaultExtensions,
          editable: false,
        });
        editorRef.current = editor;

        editor.commands.setContent(conversationHistory.message, false, {
          preserveWhitespace: true,
        });
      }
      // Clean up on unmount
      return () => {
        editor && editor.destroy();
      };
    }, [id, conversationHistory.message]);

    const getIcon = () => {
      if (conversationHistory.userType === UserTypeEnum.User) {
        return <UserAvatar user={user} />;
      }

      return <AI size={16} />;
    };

    return (
      <div className="flex px-3 gap-2 border-b border-border py-4">
        <div className="shrink-0">{getIcon()}</div>

        <div id={id}></div>
      </div>
    );
  },
);
