import { Editor } from '@tiptap/core';

export interface AttrType {
  src?: string;
  alt?: string;
}

export function getNodeTypesWithImageExtension(editor: Editor): AttrType[] {
  if (!editor || !editor.schema) {
    throw new Error('Invalid editor instance provided.');
  }

  const { state } = editor;
  const nodesWithAttrs: AttrType[] = [];

  // Traverse the document and inspect nodes
  state.doc.descendants((node) => {
    const nodeAttrs = node.attrs;

    // Only add nodes with attributes to the result
    if (
      node.type.name === 'imageExtension' &&
      nodeAttrs &&
      Object.keys(nodeAttrs).length > 0
    ) {
      nodesWithAttrs.push(nodeAttrs);
    }
  });

  return nodesWithAttrs;
}
