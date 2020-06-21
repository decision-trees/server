import { Express, Router } from 'express';
import Logger from 'bunyan';
import passport from 'passport';

import { EntityController } from './controller/entityController';
import entityRouter from './router/entityRouter';

export default function setup(server: Express, config: any, logger: Logger) {
  server.use(
    '/api/entity',
    passport.authenticate('jwt', { session: false }),
    entityRouter()
  );
}
