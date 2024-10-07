import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { TegonIssueComponent } from './tegon-issue-component';

export const tegonIssueExtension = Node.create({
  name: 'tegonIssueExtension',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      url: {
        default: undefined,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'tegon-issue-extension',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['tegon-issue-extension', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TegonIssueComponent, {
      contentDOMElementTag: 'span',
      as: 'span',
    });
  },
});
