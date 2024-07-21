export interface VerifyInstallationBody {
  installationId: string;
  workspaceId: string;
  code: string;
  orgSlug: string;
}
