import Logger from 'bunyan';
import { Request, Response, NextFunction } from 'express';

import {
  MongoDBEntityProvider,
  MongoDBSessionProvider,
} from '@decision-trees/mongodb';

import { Request as UtilsRequest } from '../utils/express';

export function DecisionTree(logger: Logger) {
  const entityProvider = new MongoDBEntityProvider();
  const sessionProvider = new MongoDBSessionProvider();

  return (req: Request, res: Response, next: NextFunction) => {
    const utilsRequest = req as UtilsRequest;
    utilsRequest.entityProvider = entityProvider;
    utilsRequest.sessionProvider = sessionProvider;
    next();
  };
}
