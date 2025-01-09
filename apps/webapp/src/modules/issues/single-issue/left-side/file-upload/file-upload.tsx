import { Button } from '@tegonhq/ui/components/button';
import { useEditor } from '@tegonhq/ui/components/editor/editor';
import { uploadFileFn, uploadFn } from '@tegonhq/ui/components/editor/utils';
import { Paperclip } from 'lucide-react';

interface FileUploadProps {
  withPosition?: boolean;
}

export function FileUpload({ withPosition = true }: FileUploadProps) {
  const { editor } = useEditor();

  const onClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'file/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const pos = editor.state.doc.content.size;

        // Check if the file is an image
        if (file.type.startsWith('image/')) {
          uploadFn(file, editor, pos);
        } else {
          uploadFileFn(file, editor, pos);
        }
      }
    };
    input.click();
  };

  if (!withPosition) {
    return (
      <Button variant="ghost" onClick={onClick}>
        <Paperclip size={16} />
      </Button>
    );
  }

  return (
    <div className="absolute bottom-2 right-2 px-6">
      <Button variant="secondary" onClick={onClick}>
        <Paperclip size={16} />
      </Button>
    </div>
  );
}
