import path from "path";
import fs from "node:fs";
import { log } from "@clack/prompts";

/**
 * Check if tegon.config.ts exists in the current directory.
 * @returns {boolean} True if tegon.config.ts exists, otherwise false.
 */
export function checkTegonConfig() {
  const tegonConfigPath = path.join(process.cwd(), "tegon.config.ts");

  if (!fs.existsSync(tegonConfigPath)) {
    log.error("tegon.config.ts not found in the current directory. Exiting...");
    process.exit(1);
  }

  return true;
}
