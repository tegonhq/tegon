export enum InviteStatus {
  INVITED = 'INVITED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class Invite {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  sentAt: Date;
  expiresAt: Date;
  emailId: string;
  fullName: string;
  workspaceId: string;
  status: InviteStatus;
  teamIds: string[];
  role: Role;
}
