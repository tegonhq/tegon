import { RiMailFill } from '@remixicon/react';
import { SlackIcon } from '@tegonhq/ui/icons';

export const ICON_MAPPING = {
  slack: SlackIcon,
  email: RiMailFill,
};

export type IconType = keyof typeof ICON_MAPPING;

export function getIcon(icon: IconType) {
  return ICON_MAPPING[icon];
}
