import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelName, ModelNameEnum } from '@tegonhq/types';
import { configure } from '@trigger.dev/sdk/v3';
import { Client } from 'pg';
import {
  LogicalReplicationService,
  Wal2JsonPlugin,
} from 'pg-logical-replication';

import { SyncGateway } from 'modules/sync/sync.gateway';
import SyncActionsService from 'modules/sync-actions/sync-actions.service';

import {
  logChangeType,
  logType,
  tablesToSendMessagesFor,
  tablesToTrigger,
} from './replication.interface';

const REPLICATION_SLOT_NAME = 'tegon_replication_slot';
const REPLICATION_SLOT_PLUGIN = 'wal2json';

@Injectable()
export default class ReplicationService {
  client: Client;
  private readonly logger: Logger = new Logger('ReplicationService');

  constructor(
    private configService: ConfigService,
    private syncGateway: SyncGateway,
    private syncActionsService: SyncActionsService,
  ) {
    this.client = new Client({
      user: configService.get('POSTGRES_USER'),
      host: configService.get('DB_HOST'),
      database: configService.get('POSTGRES_DB'),
      password: configService.get('POSTGRES_PASSWORD'),
      port: configService.get('DB_PORT'),
    });
    configure({
      secretKey: process.env['TRIGGER_SECRET_KEY'],
    });
  }

  async init() {
    await this.createReplicationSlot();
    await this.setupReplication();
  }

  async deleteSlot() {
    try {
      const deleteReplicationSlotQuery = `SELECT pg_drop_replication_slot('${REPLICATION_SLOT_NAME}')`;

      await this.client.query(deleteReplicationSlotQuery);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async checkForSlot() {
    const checkReplicationSlotQuery = `
    SELECT * FROM pg_replication_slots WHERE slot_name = '${REPLICATION_SLOT_NAME}'
  `;

    const checkSlotResult = await this.client.query(checkReplicationSlotQuery);

    if (checkSlotResult.rows.length > 0) {
      await this.deleteSlot();
    }
  }

  async createReplicationSlot() {
    try {
      await this.client.connect();

      await this.checkForSlot();

      const createReplicationSlotQuery = `
        SELECT * FROM pg_create_logical_replication_slot(
          '${REPLICATION_SLOT_NAME}',
          '${REPLICATION_SLOT_PLUGIN}'
        )
      `;

      // Create replication slot
      const result = await this.client.query(createReplicationSlotQuery);

      this.logger.log('Replication slot created successfully:', result.rows[0]);
    } catch (error) {
      this.logger.error('Error creating replication slot:', error);
    } finally {
      await this.client.end();
    }
  }

  async setupReplication() {
    const dbSchema = this.configService.get('DB_SCHEMA');
    const clientConfig = {
      host: this.configService.get('DB_HOST'),
      database: this.configService.get('POSTGRES_DB'),
      user: this.configService.get('POSTGRES_USER'),
      password: this.configService.get('POSTGRES_PASSWORD'),
      port: this.configService.get('DB_PORT'),
    };
    const service = new LogicalReplicationService(clientConfig);
    const plugin = new Wal2JsonPlugin();
    service
      .subscribe(plugin, REPLICATION_SLOT_NAME)
      .catch((e) => {
        this.logger.error(e);
      })
      .then(() => {
        this.logger.log('Replication server connected');
      });

    service.on('data', (_lsn: string, log: logType) => {
      // log contains change data in JSON format
      if (log.change) {
        log.change.forEach(async (change: logChangeType) => {
          if (change.schema !== dbSchema || change.kind === 'delete') {
            return;
          }

          const { columnvalues, columnnames } = change;
          const modelName = change.table as ModelNameEnum;
          const deletedIndex = columnnames?.indexOf('deleted');
          const isDeleted = deletedIndex !== -1 && !!columnvalues[deletedIndex];
          const idIndex = columnnames.indexOf('id');
          const modelId = columnvalues[idIndex];

          if (tablesToSendMessagesFor.has(modelName)) {
            const syncActionData =
              await this.syncActionsService.upsertSyncAction(
                _lsn,
                change.kind,
                modelName,
                modelId,
                isDeleted,
              );

            const recipientId =
              modelName === ModelName.Notification
                ? syncActionData.data.userId
                : syncActionData.workspaceId;

            this.syncGateway.wss
              .to(recipientId)
              .emit('message', JSON.stringify(syncActionData));
          }

          if (tablesToTrigger.has(modelName)) {
            // tasks.trigger(`${modelName}-trigger`, {
            //   action: change.kind,
            //   modelName,
            //   modelId,
            //   isDeleted,
            // });
          }
        });
      } else {
        this.logger.log('No change data in log');
      }
    });
  }
}
