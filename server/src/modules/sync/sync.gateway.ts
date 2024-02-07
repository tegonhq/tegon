/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { hasValidHeader } from 'common/authentication';

@WebSocketGateway()
export class SyncGateway implements OnGatewayConnection {
  @WebSocketServer() wss: Server;
  private readonly logger: Logger = new Logger('OwnerGateway');

  async handleConnection(client: Socket) {
    this.logger.log(`Connection is made by ${client.id}`);

    const { query, headers } = client.handshake;

    console.log(query);
    if (hasValidHeader(headers['authorization'])) {
      client.disconnect();
    }
  }
}
