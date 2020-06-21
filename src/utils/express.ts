import * as express from 'express';

import { EntityProvider, SessionProvider } from '@decision-trees/core';

import { User } from '../model/User';
import { WrappedLogger } from './logger';
import { AppAbility } from './abilities';

export interface Request extends express.Request {
  logger: WrappedLogger;
  traceId: String;
  user: User;
  ability: AppAbility;
  entityProvider: EntityProvider;
  sessionProvider: SessionProvider;
  _upload: any;
}
