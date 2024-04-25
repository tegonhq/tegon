/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface VerifyInstallationBody {
  installationId: string;
  workspaceId: string;
  code: string;
  orgSlug: string;
  redirectURL: string;
}
