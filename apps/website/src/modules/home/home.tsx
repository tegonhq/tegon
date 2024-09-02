import { Button } from '@tegonhq/ui/components/button';
import Image from 'next/image';
import { useState } from 'react';

import { Announcement } from 'components/accouncement';
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from 'components/page';

import { Actions } from './features/actions';
import { Triage } from './features/triage';
import { Nav } from './nav';
import { Opensource } from './opensource';

export function Home() {
  const [tab, setTab] = useState('Issue tracker');

  return (
    <div className="container relative">
      <PageHeader className="my-4">
        <Announcement />
        <PageHeaderHeading>The dev-first issue tracking tool</PageHeaderHeading>
        <PageHeaderDescription>
          Open-source, customizable, and lightweight.
        </PageHeaderDescription>

        <PageActions>
          <Button
            size="xl"
            className="text-md"
            onClick={() => {
              window.location.href = 'https://app.tegon.ai';
            }}
          >
            Get started for free
          </Button>
        </PageActions>
      </PageHeader>

      <Nav tab={tab} setTab={setTab} />
      <section className="rounded border bg-background">
        <Image
          src={`/home/${tab}.png`}
          width={1280}
          height={500}
          alt={tab}
          className="dark:block rounded w-full"
        />
      </section>

      <section className="rounded bg-background flex justify-center mt-16 gap-2 items-center">
        <div> Backend by</div>
        <Image
          src="/yc.png"
          width={120}
          height={80}
          alt={tab}
          className="dark:block rounded"
        />
      </section>

      <section className="rounded flex flex-col">
        <Actions />
      </section>
      <section className="rounded flex flex-col">
        <Triage />
      </section>

      <section className="rounded flex flex-col">
        <Opensource />
      </section>
    </div>
  );
}
