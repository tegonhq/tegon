/** Copyright (c) 2024, Tegon, all rights reserved. **/

import getConfig from 'next/config';
import Router from 'next/router';
import SessionReact from 'supertokens-auth-react/recipe/session';
import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword';

const { publicRuntimeConfig } = getConfig();

export const frontendConfig = () => {
  const appInfo = {
    appName: 'Tegon',
    apiDomain: publicRuntimeConfig.NEXT_PUBLIC_BASE_HOST,
    websiteDomain: publicRuntimeConfig.NEXT_PUBLIC_BASE_HOST,
    apiBasePath: '/api/auth',
    websiteBasePath: '/auth/signin',
  };

  return {
    appInfo,
    recipeList: [ThirdPartyEmailPasswordReact.init(), SessionReact.init()],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    windowHandler: (oI: any) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href: string) => {
            Router.push(href);
          },
        },
      };
    },
  };
};
