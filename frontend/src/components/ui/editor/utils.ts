/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { createImageUpload } from 'novel/plugins';

const onUpload = async (file: File) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workspaceId = (window as any).workspaceId;
  const formData = new FormData();

  formData.append('files', file);

  formData.append('workspaceId', '222940f7-2a22-41cb-bd83-02f999033a93');
  const promise = fetch(
    `/api/v1/attachment/upload?workspaceId=${workspaceId}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  // This should return a src of the uploaded image
  return promise;
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes('image/')) {
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      return false;
    }
    return true;
  },
});
