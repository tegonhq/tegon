/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2023, Poozle, all rights reserved. **/

import { cloneElement } from 'react';
import * as React from 'react';

import { useGetUserQuery } from 'services/users/get_user';

import { UserContext } from 'store/user_context';

import { Loader } from '../ui/loader';

interface Props {
  children: React.ReactElement;
}

export function GetUserData(props: Props): React.ReactElement {
  const { children } = props;
  const { data, error: isError, isLoading } = useGetUserQuery();

  if (!isLoading && !isError) {
    return (
      <UserContext.Provider value={data}>
        {cloneElement(children)}
      </UserContext.Provider>
    );
  }

  return <Loader />;
}
