import getConfig from 'next/config';
import Router from 'next/router';
import Passwordless from 'supertokens-auth-react/recipe/passwordless';
import SessionReact from 'supertokens-auth-react/recipe/session';

const { publicRuntimeConfig } = getConfig();

export const frontendConfig = () => {
  const appInfo = {
    appName: 'Tegon',
    apiDomain: publicRuntimeConfig.NEXT_PUBLIC_BASE_HOST,
    websiteDomain: publicRuntimeConfig.NEXT_PUBLIC_BASE_HOST,
    apiBasePath: '/api/auth',
    websiteBasePath: '/auth',
  };

  return {
    appInfo,
    recipeList: [
      Passwordless.init({
        contactMethod: 'EMAIL',
      }),
      SessionReact.init({
        sessionTokenBackendDomain: '.tegon.ai',
      }),
    ],
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
