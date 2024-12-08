import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ImageComponent } from './image-component';

export const imageExtension = Node.create({
  name: 'imageExtension',
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
      uploading: {
        default: false,
      },
      openViewer: {
        default: false,
      },
      progress: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'image-extension',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['image-extension', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
