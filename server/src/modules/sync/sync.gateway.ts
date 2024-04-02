/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { ClientMetadata } from './sync.interface';
import { isValidAuthentication } from './sync.utils';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_HOST.split(',') || '',
    credentials: true,
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

    const { query, headers } = client.handshake;
    const isValid = isValidAuthentication(headers);

    if (!isValid) {
      this.logger.log(`Connection disconnected ${client.id}`);
      client.disconnect(true);
      return;
    }

    this.clientsMetadata[client.id] = {
      workspaceId: query.workspaceId as string,
      userId: query.userId as string,
    };

    client.join(query.workspaceId);
    client.join(query.userId);
  }
}
