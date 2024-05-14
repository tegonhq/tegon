/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiDownloadLine, RiFileLine } from '@remixicon/react';
import { NodeViewWrapper } from '@tiptap/react';
import { filesize } from 'filesize';
import React from 'react';

import { Button } from 'components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileComponent = (props: any) => {
  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        <div
          className="flex w-full items-center p-4 border bg-active rounded-md gap-2 hover:bg-active/50"
          onClick={() => {
            window.open(props.node.attrs.url, '_blank');
          }}
        >
          <RiFileLine size={16} />

          <div className="grow text-sm flex flex-col justify-center">
            <div>{props.node.attrs.name}</div>
            {props.node.attrs.size > 0 && (
              <div>
                {filesize(props.node.attrs.size, { standard: 'jedec' })}
              </div>
            )}
          </div>

          <Button variant="ghost" size="xs">
            <RiDownloadLine
              size={16}
              onClick={() => {
                window.open(props.node.attrs.url, '_blank');
              }}
            />
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
