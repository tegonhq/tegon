/* eslint-disable @typescript-eslint/no-explicit-any */
export function findNodeById(content: any, id: string): any {
  if (!content || typeof content !== 'object') {
    return null;
  }

  // Check if the current node has the desired `id` attribute
  if (content.attrs?.id === id) {
    return content;
  }

  // Recursively search in child nodes
  if (content.content && Array.isArray(content.content)) {
    for (const child of content.content) {
      const result = findNodeById(child, id);
      if (result) {
        return result;
      }
    }
  }

  return null;
}
