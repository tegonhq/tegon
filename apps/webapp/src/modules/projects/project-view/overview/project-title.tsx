import { Textarea } from '@tegonhq/ui/components/textarea';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface ProjectTitleProps {
  value: string;
  onChange?: (value: string) => void;
}

// When the issue title changes in the background this doesn't get updated
// TODO: fix this
export function ProjectTitle({ value, onChange }: ProjectTitleProps) {
  const [inputValue, setInputValue] = React.useState(value);

  const debouncedUpdates = useDebouncedCallback(async (title: string) => {
    onChange && onChange(title);
  }, 500);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.currentTarget.value);
    debouncedUpdates(e.currentTarget.value);
  };

  return (
    <Textarea
      className="border-0 px-6 py-0 font-medium resize-none bg-transparent no-scrollbar overflow-hidden outline-none focus-visible:ring-0 text-xl"
      rows={1}
      cols={1}
      value={inputValue}
      placeholder="Project title"
      onChange={onInputChange}
    />
  );
}
