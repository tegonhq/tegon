import { Button } from '@tegonhq/ui/components/button';
import React from 'react';

import { useGetPatsQuery } from 'services/users/get-pats';

import { CreatePat } from './create-pat';
import { Pat } from './pat';

export function PersonalTokens() {
  const [newTokenCreation, setNewTokenCreation] = React.useState(false);
  const { data: pats, refetch } = useGetPatsQuery();

  const onCancel = () => {
    refetch();
    setNewTokenCreation(false);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Button
              disabled={newTokenCreation}
              variant="secondary"
              size="lg"
              onClick={() => {
                setNewTokenCreation(true);
              }}
            >
              New token
            </Button>
          </div>
        </div>

        {newTokenCreation && (
          <div className="my-3">
            <CreatePat onCancel={onCancel} />
          </div>
        )}
      </div>
      <div>{pats && pats.map((pat) => <Pat key={pat.id} pat={pat} />)}</div>
    </div>
  );
}
