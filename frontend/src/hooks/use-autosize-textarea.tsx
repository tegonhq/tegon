/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

// Updates the height of a <textarea> when the value changes.
export const useAutoSizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
) => {
  React.useEffect(() => {
    if (textAreaRef && textAreaRef.style) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = '0px';
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, value]);
};
