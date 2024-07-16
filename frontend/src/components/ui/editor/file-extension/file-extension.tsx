import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { FileComponent } from './file-component';

export const fileExtension = Node.create({
  name: 'fileExtension',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: undefined,
      },
      alt: {
        default: undefined,
      },
      size: {
        default: 0,
      },
      url: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'file-extension',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['file-extension', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileComponent);
  },
});
