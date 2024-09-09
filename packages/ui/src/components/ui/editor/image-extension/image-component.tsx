/* eslint-disable @next/next/no-img-element */
import { RiDownloadLine } from '@remixicon/react';
import { NodeViewWrapper } from '@tiptap/react';
import React from 'react';

import { CrossLine, FullscreenLine } from '@tegonhq/ui/icons';

import { Button } from '../../button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ImageComponent = (props: any) => {
  const setOpen = (openViewer: boolean) => {
    props.updateAttributes({
      openViewer,
    });
  };

  React.useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (props.node.attrs.openViewer) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listener when the component unmounts or full screen is closed
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.node.attrs.openViewer]);

  console.log(props.node.attrs);

  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        <div className="relative flex w-fit items-center p-3 bg-grayAlpha-100 rounded-lg gap-2 my-1">
          <img
            src={props.node.attrs.src}
            alt={props.node.attrs.alt}
            className="max-w-[400px] rounded"
          />
          <div className="flex bg-background-3 rounded absolute right-4 top-4 p-1">
            <Button
              variant="ghost"
              onClick={() => {
                window.open(props.node.attrs.src, '_blank');
              }}
            >
              <RiDownloadLine size={16} />
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                setOpen(true);
              }}
            >
              <FullscreenLine size={16} />
            </Button>
          </div>

          {props.node.attrs.openViewer && (
            <div className="fixed inset-0 bg-background bg-opacity-80 flex justify-center items-center z-50 p-6">
              <div className="relative">
                <img
                  src={props.node.attrs.src}
                  alt="fullscreen"
                  style={{
                    maxWidth: '800px',
                  }}
                />
                <Button
                  onClick={() => setOpen(false)}
                  variant="secondary"
                  className="absolute top-4 right-4 bg-background-3"
                >
                  <CrossLine />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};
