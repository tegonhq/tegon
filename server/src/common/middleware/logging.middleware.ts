/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Prisma } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loggingMiddleware(logger: any = console): Prisma.Middleware {
  return async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    logger.log(
      `Prisma Query ${params.model}.${params.action} took ${after - before}ms`,
    );

    return result;
  };
}
