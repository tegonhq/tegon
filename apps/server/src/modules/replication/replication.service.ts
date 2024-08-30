import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelNameEnum } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';
import { Client } from 'pg';
import {
  LogicalReplicationService,
  Wal2JsonPlugin,
} from 'pg-logical-replication';
import { v4 as uuidv4 } from 'uuid';

import ActionEventService from 'modules/action-event/action-event.service';
import { SyncGateway } from 'modules/sync/sync.gateway';
import SyncActionsService from 'modules/sync-actions/sync-actions.service';
import { getWorkspaceId } from 'modules/sync-actions/sync-actions.utils';

import {
  logChangeType,
  logType,
  tablesToSendMessagesFor,
  tablesToTrigger,
} from './replication.interface';

const REPLICATION_SLOT_PLUGIN = 'wal2json';

@Injectable()
export default class ReplicationService {
  client: Client;
  private readonly logger: Logger = new Logger('ReplicationService');
  private replicationSlotName = `tegon_replication_slot_${uuidv4().replace(/-/g, '')}`;

  constructor(
    private configService: ConfigService,
    private syncGateway: SyncGateway,
    private syncActionsService: SyncActionsService,
    private actionEventService: ActionEventService,
    private prisma: PrismaService,
  ) {
    this.client = new Client({
      user: configService.get('POSTGRES_USER'),
      host: configService.get('DB_HOST'),
      database: configService.get('POSTGRES_DB'),
      password: configService.get('POSTGRES_PASSWORD'),
      port: configService.get('DB_PORT'),
    });
  }

  async init() {
    await this.client.connect();

    await this.deleteOrphanedSlots();
    await this.createReplicationSlot();
    await this.setupReplication();
  }

  async deleteOrphanedSlots() {
    try {
      // Query to find all inactive replication slots
      const findInactiveSlotsQuery = `
        SELECT slot_name 
        FROM pg_replication_slots 
        WHERE active = false;
      `;

      const result = await this.client.query(findInactiveSlotsQuery);

      // Loop through and delete each inactive slot
      for (const row of result.rows) {
        const slotName = row.slot_name;
        try {
          await this.deleteSlot(slotName);
          this.logger.log(
            `Orphaned replication slot ${slotName} deleted successfully.`,
          );
        } catch (err) {
          this.logger.error(
            `Error deleting replication slot ${slotName}:`,
            err,
          );
        }
      }
    } catch (err) {
      this.logger.error(
        'Error finding or deleting orphaned replication slots:',
        err,
      );
    }
  }

  async deleteSlot(name: string) {
    try {
      const deleteReplicationSlotQuery = `SELECT pg_drop_replication_slot('${name}')`;

      await this.client.query(deleteReplicationSlotQuery);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async checkForSlot() {
    const checkReplicationSlotQuery = `
    SELECT * FROM pg_replication_slots WHERE slot_name = '${this.replicationSlotName}'
  `;

    const checkSlotResult = await this.client.query(checkReplicationSlotQuery);

    if (checkSlotResult.rows.length > 0) {
      await this.deleteSlot(this.replicationSlotName);
    }
  }

  async createReplicationSlot() {
    try {
      await this.setReplicaIdentityFull();

      await this.checkForSlot();

      const createReplicationSlotQuery = `
        SELECT * FROM pg_create_logical_replication_slot(
          '${this.replicationSlotName}',
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

  async setReplicaIdentityFull() {
    try {
      await this.prisma.$executeRaw`ALTER TABLE "Issue" REPLICA IDENTITY FULL`;
      await this.prisma
        .$executeRaw`ALTER TABLE "IssueComment" REPLICA IDENTITY FULL`;
      await this.prisma
        .$executeRaw`ALTER TABLE "LinkedIssue" REPLICA IDENTITY FULL`;

      this.logger.log('REPLICA IDENTITY FULL set for all specified tables.');
    } catch (error) {
      this.logger.error('Error setting REPLICA IDENTITY FULL:', error);
    }
  }

  getChangedData(change: logChangeType) {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-explicit-any
    const changedData: { [key: string]: any } = {};
    const keyNames = change.oldkeys?.keynames || [];
    const oldValues = change.oldkeys?.keyvalues || [];
    const columnNames = change.columnnames || [];
    const newValues = change.columnvalues || [];

    // Create a map of old values by key name
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-explicit-any
    const oldValueMap: { [key: string]: any } = {};
    keyNames.forEach((keyName, index) => {
      oldValueMap[keyName] = oldValues[index];
    });

    // Compare each column to see if the value has changed
    columnNames.forEach((columnName, index) => {
      const oldValue = oldValueMap[columnName];
      const newValue = newValues[index];

      // Check if the old value and new value are different
      if (oldValue !== undefined && oldValue !== newValue) {
        changedData[columnName] = newValue;
      }
    });

    return changedData;
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
    const plugin = new Wal2JsonPlugin({});
    service
      .subscribe(plugin, this.replicationSlotName)
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

          // Log or process the changed data

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
                isDeleted ? 'delete' : change.kind,
                modelName,
                modelId,
              );

            const recipientId =
              modelName === ModelNameEnum.Notification
                ? syncActionData.data.userId
                : syncActionData.workspaceId;

            this.syncGateway.wss
              .to(recipientId)
              .emit('message', JSON.stringify(syncActionData));
          }

          if (tablesToTrigger.has(modelName)) {
            const changedData = this.getChangedData(change);

            const workspaceId = await getWorkspaceId(
              this.prisma,
              modelName,
              modelId,
            );

            await this.actionEventService.createEvent({
              modelName,
              modelId,
              eventType: isDeleted ? 'delete' : change.kind,
              eventData: changedData,
              workspaceId,
              sequenceId: _lsn,
            });
          }
        });
      } else {
        this.logger.log('No change data in log');
      }
    });
  }
}
