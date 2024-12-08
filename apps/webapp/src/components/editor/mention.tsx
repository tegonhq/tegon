import { cn } from '@tegonhq/ui/lib/utils';
import Mention from '@tiptap/extension-mention';
import {
  mergeAttributes,
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import { observer } from 'mobx-react-lite';

import type { User } from 'common/types';

import { useUsersData } from 'hooks/users';

export const MentionComponent = observer((props: NodeViewProps) => {
  const { users } = useUsersData(false);

  const user = users.find((user: User) => user.id === props.node.attrs.id);

  return (
    <NodeViewWrapper className="inline w-fit">
      <span
        className={cn(
          'mention bg-grayAlpha-100 p-0.5 px-1 rounded-sm text-primary',
        )}
      >
        {user.fullname}
      </span>
    </NodeViewWrapper>
  );
});

export const CustomMention = Mention.extend({
  addNodeView() {
    return ReactNodeViewRenderer(MentionComponent);
  },
  parseHTML() {
    return [
      {
        tag: 'mention-component',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mention-component', mergeAttributes(HTMLAttributes)];
  },
});
