export enum InviteStatusEnum {
  INVITED = 'INVITED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export const InviteStatus = {
  INVITED: 'INVITED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
};

export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus];

export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type Role = (typeof Role)[keyof typeof Role];

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
