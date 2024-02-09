/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Websocket } from 'modules/sync/sync';

import { AppLayout } from 'layouts/app-layout';

export default function WorkspaceHome() {
  return (
    <>
      <h1>Harshith</h1> <Websocket />
    </>
  );
}

WorkspaceHome.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
