import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@casl/ability';

import { Request as UtilsRequest } from '../../utils/express';

export function EntityController() {
  return {
    list: (req: Request, res: Response) => {
      const utilsRequest = req as UtilsRequest;
      const { entityProvider, query } = utilsRequest;
      const { skip = '0', limit = '20' } = query;
      entityProvider
        .list(parseInt(skip as string, 10), parseInt(limit as string, 10))
        .then((entityResultList) => {
          res.json(entityResultList);
        });
    },
    create: (req: Request, res: Response) => {
      const utilsRequest = req as UtilsRequest;
      const { entityProvider, body } = utilsRequest;
      const { type } = body;
      entityProvider.create(type).then((entity) => {
        res.json(entity);
      });
    },
    read: (req: Request, res: Response) => {
      const utilsRequest = req as UtilsRequest;
      const { entityProvider, params } = utilsRequest;
      const { id } = params;
      entityProvider.read(id).then((entity) => {
        res.json(entity);
      });
    },
    update: (req: Request, res: Response) => {
      const utilsRequest = req as UtilsRequest;
      const { entityProvider, params, body } = utilsRequest;
      const { id } = params;
      entityProvider.update(id, body).then((entity) => {
        res.json(entity);
      });
    },
    delete: (req: Request, res: Response) => {
      const utilsRequest = req as UtilsRequest;
      const { entityProvider, params } = utilsRequest;
      const { id } = params;
      entityProvider.delete(id).then(() => {
        res.send();
      });
    },
  };
}
