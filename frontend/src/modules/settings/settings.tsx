/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { SettingsLayout } from 'layouts/settings-layout';

export function Settings() {
  return <h1> Settings </h1>;
}

Settings.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
