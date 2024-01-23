/** Copyright (c) 2024, Tegon, all rights reserved. **/

export class WorkspaceCreateBody {
  slug: string;
}

export class WorkspaceUpdateBody {
  initialSetupComplete: boolean;

  workspaceId: string;
}

export class WorkspaceRequestIdBody {
  workspaceId: string;
}

export class WorkspaceRequestSlugBody {
  slug: string;
}

export interface ControllerReponse {
  status: string;
}
