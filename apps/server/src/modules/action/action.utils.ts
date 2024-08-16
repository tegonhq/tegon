import fsModule from 'fs/promises';
import { tmpdir } from 'node:os';
import pathModule from 'node:path';

// Create a temporary directory within the OS's temp directory
export async function createTempDir(): Promise<string> {
  // Generate a unique temp directory path
  const tempDirPath: string = pathModule.join(tmpdir(), 'tegon-temp-');

  // Create the temp directory synchronously and return the path
  const directory = await fsModule.mkdtemp(tempDirPath);

  return directory;
}
