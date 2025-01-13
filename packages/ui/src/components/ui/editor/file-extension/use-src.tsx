import axios from 'axios';
import React from 'react';

function getAttachmentId(defaultSrc: string, attachmentId: string) {
  if (defaultSrc.includes('blob:')) {
    return undefined;
  }

  return attachmentId ? attachmentId : defaultSrc.split('/').pop();
}

export const useSrc = (defaultSrc: string, attachmentId: string) => {
  const [loading, setLoading] = React.useState(false);
  const [src, setSrc] = React.useState(undefined);
  const computeAttachmentID = getAttachmentId(defaultSrc, attachmentId);

  React.useEffect(() => {
    if (computeAttachmentID) {
      getData();
    } else {
      setSrc(src);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeAttachmentID]);

  const getData = async () => {
    setLoading(true);

    try {
      const {
        data: { signedUrl },
      } = await axios.get(
        `/api/v1/attachment/get-signed-url/${computeAttachmentID}`,
        {
          withCredentials: true,
        },
      );
      setSrc(signedUrl);
    } catch (e) {
      setSrc(defaultSrc);
    }

    setLoading(false);
  };

  return { loading, src };
};
