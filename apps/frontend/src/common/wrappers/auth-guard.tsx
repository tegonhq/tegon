import { useRouter } from 'next/router';
import React, { cloneElement } from 'react';
import Session from 'supertokens-web-js/recipe/session';

import { Loader } from 'components/ui/loader';

interface Props {
  children: React.ReactElement;
}

export function AuthGuard(props: Props): React.ReactElement {
  const { children } = props;
  const router = useRouter();
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkForSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkForSession() {
    if (await Session.doesSessionExist()) {
      router.replace('/');
    } else {
      setLoading(false);
    }
  }

  if (!isLoading) {
    return cloneElement(children);
  }

  return <Loader />;
}
