/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import {
  LogicalReplicationService,
  Wal2JsonPlugin,
} from 'pg-logical-replication';

import { SyncGateway } from 'modules/sync/sync.gateway';

const REPLICATION_SLOT_NAME = 'repl';
// const REPLICATION_SLOT_PLUGIN = 'wal2json';

@Injectable()
export default class ReplicationService {
  client: Client;

  constructor(
    private configService: ConfigService,
    private syncGateway: SyncGateway,
  ) {
    this.client = new Client({
      connectionString: this.configService.get('REPLICATION_DATABASE_URL'),
    });
  }

  async init() {
    // await this.createReplicationSlot();
    await this.setupReplication();
  }

  // async createReplicationSlot() {
  //   try {
  //     await this.client.connect();

  //     // Create replication slot
  //     const result = await this.client.query(
  //       'SELECT * FROM pg_create_logical_replication_slot($1, $2)',
  //       [REPLICATION_SLOT_NAME, { plugin: REPLICATION_SLOT_PLUGIN }],
  //     );

  //     console.log('Replication slot created successfully:', result.rows[0]);
  //   } catch (error) {
  //     console.error('Error creating replication slot:', error);
  //   } finally {
  //     await this.client.end();
  //   }
  // }

  async setupReplication() {
    const clientConfig = {
      database: this.configService.get('POSTGRES_DB'),
      user: this.configService.get('POSTGRES_USER'),
      password: this.configService.get('POSTGRES_PASSWORD'),
    };
    const service = new LogicalReplicationService(clientConfig);
    const plugin = new Wal2JsonPlugin();
    service
      .subscribe(plugin, REPLICATION_SLOT_NAME)
      .catch((e) => {
        console.error(e);
      })
      .then(() => {
        console.log('connected');
      });

    service.on('data', (_lsn, log) => {
      console.log(_lsn);
      // log contains change data in JSON format
      console.log(JSON.stringify(log));

      this.syncGateway.wss
        .to('d81f6173-60cf-46bc-bcca-4ab2921a52c3')
        .emit('message', JSON.stringify(log.change));
    });
  }
}
