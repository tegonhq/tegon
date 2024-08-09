type AuthType = 'OAuth2' | 'APIKey' | 'BasicAuth';

export interface AuthSpecification {
  type: AuthType;
  token_url: string;
  authorization_url: string;
  scope: string[];
}

export interface Authentication {
  workspace_auth: AuthSpecification;
  personal_auth?: AuthSpecification; // Optional
}

export interface LinkRegex {
  type: string;
  regex: string;
}

export interface InputField {
  label: string;
  type: 'text' | 'number' | 'select' | 'multi-select';
  placeholder?: string;
  options?: string[]; // For select or multi-select types
}

export interface IntegrationSpecification {
  authentication: Authentication;
  link_regex?: LinkRegex[];
  inputs?: Record<string, any>;
}
