import { EditorBubble, useEditor } from 'novel';
import { removeAIHighlight } from 'novel/extensions';
import {} from 'novel/plugins';
import { Fragment, type ReactNode, useEffect } from 'react';

import { AISelector } from './ai-selector';

interface GenerativeMenuSwitchProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const GenerativeMenuSwitch = ({
  children,
  open,
  onOpenChange,
}: GenerativeMenuSwitchProps) => {
  const { editor } = useEditor();

  useEffect(() => {
    if (!open) {
      removeAIHighlight(editor);
    }
  }, [open, editor]);

  return (
    <EditorBubble
      tippyOptions={{
        placement: 'top',
        onHidden: () => {
          onOpenChange(false);
        },
      }}
      className="flex w-fit items-center max-w-[90vw] overflow-hidden rounded bg-background-2 shadow-2"
    >
      {open && <AISelector open={open} onOpenChange={onOpenChange} />}
      {!open && <Fragment>{children}</Fragment>}
    </EditorBubble>
  );
};

export default GenerativeMenuSwitch;
