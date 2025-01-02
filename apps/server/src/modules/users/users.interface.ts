import { Invite, User } from '@tegonhq/types';
import { IsArray, IsString } from 'class-validator';

export class UserIdParams {
  @IsString()
  userId: string;
}

export class UpdateUserBody {
  @IsString()
  fullname: string;

  @IsString()
  username: string;
}

export class UserIdsBody {
  @IsArray()
  userIds: string[];
}

export interface PublicUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
}

export interface UserWithInvites extends User {
  invites: Invite[];
}

export function userSerializer(user: User) {
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    fullname: user.fullname,
    username: user.username,
    initialSetupComplete: user.initialSetupComplete,
    anonymousDataCollection: user.anonymousDataCollection,

    workspaces: user.usersOnWorkspaces.map((uWorkspace) => ({
      ...uWorkspace.workspace,
      status: uWorkspace.status,
      role: uWorkspace.role,
    })),
  };
}
