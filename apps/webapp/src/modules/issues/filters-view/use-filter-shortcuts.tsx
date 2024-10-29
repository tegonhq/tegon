import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

interface UseFiltershorcutsProps {
  onEscape: () => void;
  onF: () => void;
}

const LOCAL_SCOPE = 'FILTERS';

export const useFilterShorcuts = (
  { onEscape, onF }: UseFiltershorcutsProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[],
) => {
  // Shortcuts
  useHotkeys(
    Key.Escape,
    (e) => {
      e.preventDefault();
      onEscape();
    },
    {
      enableOnFormTags: true,
      scopes: [LOCAL_SCOPE],
    },
    dependencies,
  );

  useHotkeys(
    'f',
    (e) => {
      e.preventDefault();
      onF();
    },
    {
      scopes: [LOCAL_SCOPE],
    },
    dependencies,
  );
};
