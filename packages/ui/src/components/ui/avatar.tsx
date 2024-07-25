'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { getTailwindColor } from '../../lib/color-utils';
import { cn } from '../../lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex shrink-0 overflow-hidden w-[20px] h-[20px]',
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center bg-muted text-white',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Function to get the first two letters
export const getInitials = (name: string, noOfChar?: number | undefined) => {
  if (!name) {
    return '';
  }
  const words = name.split(' ');
  return words
    .map((word) => word.charAt(0))
    .filter((char) => char !== '')
    .slice(0, noOfChar ? noOfChar : 2)
    .join('')
    .toUpperCase();
};

const AvatarText = ({
  text,
  className,
  noOfChar,
}: {
  text: string;
  className?: string;
  noOfChar?: number;
}) => {
  return (
    <Avatar className={cn('flex items-center', className)}>
      <AvatarImage />
      <AvatarFallback
        className="rounded-sm"
        style={{
          background: getTailwindColor(text),
        }}
      >
        {getInitials(text, noOfChar)}
      </AvatarFallback>
    </Avatar>
  );
};

export { Avatar, AvatarImage, AvatarFallback, AvatarText };
