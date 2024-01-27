/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import React, { cloneElement } from 'react';

import { Loader } from 'components/ui/loader';

interface Props {
  children: React.ReactElement;
}

export function LoggedInGuard(props: Props): React.ReactElement {
  const { children } = props;
  const router = useRouter();
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(undefined);

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const response = await fetch('/api/v1/users');

    if (response.status === 200) {
      setData(response);

      router.replace('/teams');
    } else {
    }

    setLoading(false);
  };

  if (!isLoading && !data) {
    return cloneElement(children);
  }

  return <Loader />;
}
