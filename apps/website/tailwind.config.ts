/* eslint-disable import/no-anonymous-default-export */
import config from '@tegonhq/ui/tailwind.config';

export default {
  ...config,
  theme: {
    ...config.theme,
    fontSize: {
      xs: '13px',
      sm: '14px',
      base: '15px',
      md: '17px',
      lg: '19px',
      xl: '26px',
    },
  },
};
