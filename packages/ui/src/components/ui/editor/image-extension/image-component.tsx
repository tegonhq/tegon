/* eslint-disable @next/next/no-img-element */
import { RiDownloadLine } from '@remixicon/react';
import { NodeViewWrapper } from '@tiptap/react';
import { ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { ArrowLeft, Close, FullscreenLine } from '@tegonhq/ui/icons';

import { getNodeTypesWithImageExtension, type AttrType } from './utils';
import { Button } from '../../button';
import { Loader } from '../../loader';
import { Progress } from '../../progress';
import { useEditor } from '../editor';
import { useSrc } from '../file-extension/use-src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ImageComponent = (props: any) => {
  const { editor } = useEditor();
  const { loading, src } = useSrc(
    props.node.attrs.src,
    props.node.attrs.attachmentId,
  );
  const [openViewer, setOpenViewer] = React.useState(false);

  const images = getNodeTypesWithImageExtension(editor);

  if (loading) {
    return null;
  }

  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        <div className="relative flex w-fit items-center p-2 bg-grayAlpha-100 rounded-lg gap-2 my-1 overflow-hidden">
          <div className="flex flex-col">
            <img
              src={src}
              alt={props.node.attrs.alt}
              className="max-w-[400px] rounded"
            />
            {props.node.attrs.uploading && (
              <div className="w-full mt-2">
                <Progress
                  color="#1a89c5"
                  segments={[{ value: props.node.attrs.progress }]}
                />
              </div>
            )}
          </div>

          {props.node.attrs.uploading && (
            <>
              <div className="absolute left-0 top-0 w-full h-full bg-grayAlpha-200 flex items-center rounded-md">
                <Loader />
              </div>
            </>
          )}

          {!props.node.attrs.uploading && (
            <div className="flex bg-background-3 rounded absolute right-4 top-4 p-1">
              <Button
                variant="ghost"
                size="xs"
                className="px-1"
                onClick={() => {
                  window.open(src, '_blank');
                }}
              >
                <RiDownloadLine size={16} />
              </Button>

              <Button
                variant="ghost"
                size="xs"
                className="px-1"
                onClick={() => {
                  setOpenViewer(true);
                }}
              >
                <FullscreenLine size={16} />
              </Button>
            </div>
          )}

          {openViewer && (
            <Lightbox
              open
              render={{
                iconPrev: () => <ArrowLeft />,
                iconNext: () => <ArrowRight />,
                iconClose: () => <Close />,
                iconZoomIn: () => <ZoomIn />,
                iconZoomOut: () => <ZoomOut />,
              }}
              plugins={[Zoom]}
              close={() => setOpenViewer(false)}
              slides={images.map((image: AttrType) => ({
                src: image.src,
              }))}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};
