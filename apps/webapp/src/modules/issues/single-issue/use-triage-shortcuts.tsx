import { useHotkeys } from 'react-hotkeys-hook';

interface UseTriageShortcutsProps {
  onAccept: () => void; // Function to call when the Accept shortcut is triggered
  onDecline: () => void; // Function to call when the Decline shortcut is triggered
}

export const TRIAGE_LOCAL_SCOPE = 'TRIAGE'; // Defining a local scope for triage shortcuts

export const useTriageShortcuts = ({
  onAccept,
  onDecline,
}: UseTriageShortcutsProps) => {
  // 'A' key to trigger the Accept action
  useHotkeys(
    '1', // Use Key enum for 'A'
    () => {
      onAccept(); // Trigger the onAccept callback
    },
    {
      scopes: [TRIAGE_LOCAL_SCOPE], // Scoping the shortcut to the triage view
    },
  );

  // 'D' key to trigger the Decline action
  useHotkeys(
    '2', // Use Key enum for 'D'
    () => {
      onDecline(); // Trigger the onDecline callback
    },
    {
      scopes: [TRIAGE_LOCAL_SCOPE], // Scoping the shortcut to the triage view
    },
  );
};
