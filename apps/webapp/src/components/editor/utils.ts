// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeAttrs = Record<string, any>;

interface TipTapNode {
  type: string;
  attrs?: NodeAttrs;
  content?: TipTapNode[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pendingUploads(doc: any): boolean {
  const hasPendingUploads = (nodes: TipTapNode[] | undefined): boolean => {
    if (!nodes) {
      return false;
    }

    for (const node of nodes) {
      // Check if the node is imageExtension or fileExtension with uploading: false
      if (
        (node.type === 'imageExtension' || node.type === 'fileExtension') &&
        node.attrs?.uploading === true
      ) {
        return true;
      }

      // Recursively check child nodes
      if (node.content && hasPendingUploads(node.content)) {
        return true;
      }
    }

    return false;
  };

  return hasPendingUploads(doc.content);
}
