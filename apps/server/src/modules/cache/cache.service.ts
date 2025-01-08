import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private redis: Redis;
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('CacheService');
    this.redis = new Redis({
      host: process.env.REDIS_URL || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      retryStrategy: (times: any) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('connect', () => {
      this.logger.log({ message: 'Redis client connected' });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.redis.on('error', (error: any) => {
      this.logger.error({ message: 'Redis client error', payload: error });
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
    this.logger.log({ message: 'Redis client disconnected' });
  }

  async set(key: string, value: string, expiry?: number): Promise<'OK' | null> {
    // try {
    if (expiry) {
      return await this.redis.set(key, value, 'EX', expiry);
    }
    return await this.redis.set(key, value);
    // } catch (error) {
    //   this.logger.error({
    //     message: 'Redis set error',
    //     payload: { error, key },
    //   });
    //   return null;
    // }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      this.logger.error({
        message: 'Redis get error',
        payload: { error, key },
      });
      return null;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (error) {
      this.logger.error({
        message: 'Redis del error',
        payload: { error, key },
      });
      return 0;
    }
  }
}
