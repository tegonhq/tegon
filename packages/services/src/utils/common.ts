/**
 * Checks whether the function is being invoked in Server or Client.
 * @returns True if this function is beinvoked in Next Server, False if it is in browser.
 */
export function isServer() {
  return typeof window === 'undefined';
}
