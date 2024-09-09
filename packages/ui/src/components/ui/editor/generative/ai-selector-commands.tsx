import { CommandItem, CommandList } from '@tegonhq/ui/components/command';
import { StepForward } from 'lucide-react';
import { useEditor } from 'novel';
import { getPrevText } from 'novel/utils';

import { SubIssue } from '@tegonhq/ui/icons';

const options = [
  {
    value: 'generate-sub-issues',
    label: 'Generate sub issues',
    icon: SubIssue,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandList className="p-1">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(
                slice.content,
              );
              onSelect(text, value);
            }}
            className="flex gap-2 px-2"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </CommandItem>
        ))}

        <CommandItem
          onSelect={() => {
            const pos = editor.state.selection.from;

            const text = getPrevText(editor, pos);
            onSelect(text, 'continue');
          }}
          value="continue"
          className="gap-2 px-2"
        >
          <StepForward className="h-4 w-4" />
          Continue writing
        </CommandItem>
      </CommandList>
    </>
  );
};

export default AISelectorCommands;
