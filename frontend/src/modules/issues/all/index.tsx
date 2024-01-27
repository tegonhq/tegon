/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'layouts/app-layout';

export function AllIssues() {
  return <h2>asdf</h2>;
}

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
