import { mergeAttributes, Node, type ChainedCommands } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { AIWritingComponent } from './ai-writing-component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    AiWritingExtension: {
      /**
       * create a card node
       */
      createAIWritingNode: (content: string) => ReturnType;
    };
  }
}

export const AiWritingExtension = Node.create({
  name: 'aiWritingExtension',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      content: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'ai-writing-extension',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['ai-writing-extension', mergeAttributes(HTMLAttributes)];
  },

  // @ts-expect-error This is throwing error but is the suggested way in the docs
  addCommands() {
    return {
      createAIWritingNode:
        (content: string) =>
        ({ commands }: { commands: ChainedCommands }) => {
          commands.insertContent([
            {
              type: this.name,
              attrs: {
                content,
              },
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '\n',
                },
              ],
            },
          ]);

          return commands.exitCode();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIWritingComponent);
  },
});
