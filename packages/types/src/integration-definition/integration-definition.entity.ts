import { JsonObject } from '../common';
import { IntegrationAccount } from '../integration-account';
import { Workspace } from '../workspace';

export class OAuth2Params {
  authorization_url: string;
  authorization_params?: Record<string, string>;
  default_scopes?: string[];
  scope_separator?: string;
  token_url: string;
  token_params?: Record<string, string>;
  redirect_uri_metadata?: string[];
  token_response_metadata?: string[];
  token_expiration_buffer?: number; // In seconds.
  scopes?: string[];
}

export class Spec {
  workspace_auth: {
    OAuth2: OAuth2Params;
  };
  personal_auth?: {
    OAuth2: OAuth2Params;
  };
  other_data?: JsonObject;
}

export class IntegrationDefinition {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  description: string;
  icon: string;
  spec?: Spec;
  clientId: string;
  clientSecret: string;
  workspace?: Workspace;
  workspaceId?: string;
  IntegrationAccount?: IntegrationAccount[];
}
