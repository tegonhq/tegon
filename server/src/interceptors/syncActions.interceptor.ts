/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ActionType } from '@prisma/client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import SyncActionsService from '../modules/syncActions/syncActions.service';

@Injectable()
export class SyncActionsInterceptor implements NestInterceptor {
  constructor(private syncActionService: SyncActionsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const controller = context.getClass().name;
    const handler = context.getHandler().name;

    return next.handle().pipe(
      tap((data) => {
        const [action, entity] = this.splitHandlerName(handler);
        console.log(controller, action, entity);
        if (
          action &&
          controller !== 'syncActionsController' &&
          controller !== 'syncActionsService'
        ) {
          this.syncActionService.createSyncAction(action, controller, entity, data);
        }
      }),
    );
  }

  private splitHandlerName(handler: string): [ActionType, string] {
    const action = handler.match(/^[a-z]+/)[0];
    const entity = handler.match(/[A-Z][a-z]+$/)[0];
    return [this.getActionType(action), entity];
  }

  private getActionType(action: string): ActionType {
    switch (action) {
      case 'create':
        return ActionType.I;
      case 'update':
        return ActionType.U;
      case 'delete':
        return ActionType.D;
      default:
        return null;
    }
  }
}
