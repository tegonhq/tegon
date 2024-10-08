import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum'; // Importing Key enum

interface UseTriageShortcutsProps {
  onAccept: () => void; // Function to call when the Accept shortcut is triggered
  onDecline: () => void; // Function to call when the Decline shortcut is triggered
}

const LOCAL_SCOPE = 'TRIAGE'; // Defining a local scope for triage shortcuts

/**
 * useTriageShortcuts
 * Custom hook to manage keyboard shortcuts for triage view.
 *
 * @param {Object} UseTriageShortcutsProps
 * @param {() => void} onAccept - Action when 'A' is pressed for Accept
 * @param {() => void} onDecline - Action when 'D' is pressed for Decline
 * @param {Array} dependencies - Optional dependencies to control re-binding of shortcuts
 */
export const useTriageShortcuts = (
  { onAccept, onDecline }: UseTriageShortcutsProps,
  dependencies: any[] = [], // Dependencies for re-binding if necessary
) => {
  // 'A' key to trigger the Accept action
  useHotkeys(
    Key.A, // Use Key enum for 'A'
    (e) => {
      e.preventDefault(); // Prevent default action for 'A'
      onAccept(); // Trigger the onAccept callback
    },
    {
      scopes: [LOCAL_SCOPE], // Scoping the shortcut to the triage view
    },
    dependencies, // Optional dependencies
  );

  // 'D' key to trigger the Decline action
  useHotkeys(
    Key.D, // Use Key enum for 'D'
    (e) => {
      e.preventDefault(); // Prevent default action for 'D'
      onDecline(); // Trigger the onDecline callback
    },
    {
      scopes: [LOCAL_SCOPE], // Scoping the shortcut to the triage view
    },
    dependencies, // Optional dependencies
  );
};
