import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { Check, Trash } from 'lucide-react';
import { useEditor } from 'novel';
import { useEffect, useRef } from 'react';

import { LinkLine } from '@tegonhq/ui/icons';

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) {
    return str;
  }
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }

  return null;
}

interface LinkSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { editor } = useEditor();

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });
  if (!editor) {
    return null;
  }

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 rounded border-none hover:bg-accent hover:text-accent-foreground"
        >
          <LinkLine size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-0" sideOffset={10}>
        <form
          onSubmit={(e) => {
            const target = e.currentTarget as HTMLFormElement;
            e.preventDefault();
            const input = target[0] as HTMLInputElement;
            const url = getUrlFromString(input.value);
            url && editor.chain().focus().setLink({ href: url }).run();
          }}
          className="flex items-center p-2 gap-2"
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Paste a link"
            className="flex-1 outline-none"
            defaultValue={editor.getAttributes('link').href || ''}
          />
          {editor.getAttributes('link').href ? (
            <Button
              variant="secondary"
              type="button"
              className="h-8"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="h-8" type="submit" variant="secondary">
              <Check className="h-4 w-4" />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};
