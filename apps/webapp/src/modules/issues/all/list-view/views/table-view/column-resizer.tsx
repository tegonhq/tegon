import { type Header } from '@tanstack/react-table';

import type { IssueType } from 'common/types';

export const ColumnResizer = ({
  header,
}: {
  header: Header<IssueType, unknown>;
}) => {
  if (header.column.getCanResize() === false) {
    return <></>;
  }

  return (
    <div
      {...{
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `absolute top-0 right-0 w-2 cursor-col-resize h-full hover:bg-grayAlpha-100`,
        style: {
          userSelect: 'none',
          touchAction: 'none',
        },
      }}
    />
  );
};
