import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from 'supertokens-node/recipe/session';
import { ALSService } from './als.service';

@Injectable()
export class ALSMiddleware implements NestMiddleware {
  constructor(private readonly als: ALSService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let requestId = req.headers['x-request-id'];

    if (!requestId?.length) {
      requestId = uuidv4();
      req.headers['x-request-id'] = requestId;
    }

    const session = await Session.getSession(req, res, {
      sessionRequired: false,
    });

    const store: Map<string, any> = new Map();

    store.set('opName', req.baseUrl);
    store.set('ipAddress', req.headers['x-forwarded-for']);
    store.set('requestId', requestId);
    store.set('actorId', session.getUserId());
    store.set('workspaceId', session.getTenantId());

    this.als.run(store, () => {
      next();
    });

    res.header('x-request-id', requestId);
  }
}
