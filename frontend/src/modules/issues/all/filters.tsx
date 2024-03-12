/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { useApplicationStore } from 'hooks/use-application-store';

export const Filters = observer(() => {
  const applicationStore = useApplicationStore();
  const filters = JSON.parse(applicationStore.filters);

  return <div className="py-2 pl-8 px-4"></div>;
});
