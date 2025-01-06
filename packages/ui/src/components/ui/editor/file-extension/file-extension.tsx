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
      attachmentId: {
        default: undefined,
      },
      alt: {
        default: undefined,
      },
      size: {
        default: 0,
      },
      uploading: {
        default: false,
      },
      type: {
        default: undefined,
      },
      url: {
        default: 0,
      },
      progress: {
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
