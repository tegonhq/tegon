import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { LoggerService } from 'modules/logger/logger.service';

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
  private readonly logger: LoggerService = new LoggerService('SyncGateway');

  afterInit() {
    this.logger.info({
      message: 'Websocket Module initiated',
      where: `SyncGateway.afterInit`,
    });
  }

  async handleConnection(client: Socket) {
    this.logger.info({
      message: `Connection is made by ${client.id}`,
      where: `SyncGateway.handleConnection`,
    });

    const { query, headers } = client.handshake;
    // TODO: (imp) fix this
    const isValid = isValidAuthentication(headers);

    if (!isValid) {
      this.logger.info({
        message: `Connection disconnected ${client.id}`,
        where: `SyncGateway.handleConnection`,
      });
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
