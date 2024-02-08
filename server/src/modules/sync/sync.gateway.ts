/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { hasValidHeader } from 'common/authentication';

import { ClientMetadata } from './sync.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class SyncGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() wss: Server;

  private readonly clientsMetadata: Record<string, ClientMetadata> = {};
  private readonly logger: Logger = new Logger('SyncGateway');

  afterInit() {
    this.logger.log('Websocket Module initiated');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Connection is made by ${client.id}`);
    console.log('ASdf');

    const { query } = client.handshake;

    const isValid = query.accessToken
      ? await hasValidHeader(`Bearer ${query.accessToken as string}`, false)
      : false;

    if (!isValid) {
      client.disconnect(true);
      return;
    }

    this.clientsMetadata[client.id] = {
      workspaceId: query.workspaceId as string,
      userId: query.userId as string,
    };

    client.join(query.workspaceId);
  }
}
