import { RiDiscordFill, RiMailFill } from '@remixicon/react';
import { SlackIcon, StackLine } from '@tegonhq/ui/icons';

export const ICON_MAPPING = {
  slack: SlackIcon,
  email: RiMailFill,
  discord: RiDiscordFill,

  // Default icon
  integration: StackLine,
};

export type IconType = keyof typeof ICON_MAPPING;

export function getIcon(icon: IconType) {
  if (icon in ICON_MAPPING) {
    return ICON_MAPPING[icon];
  }

  return ICON_MAPPING['integration'];
}
