import { promises, createWriteStream } from 'fs';
import { dirname, resolve } from 'path';

import express from 'express';
import { createLogger } from 'bunyan';
import { connect, plugin } from 'mongoose';
import { accessibleRecordsPlugin } from '@casl/mongoose';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';

import { ensureDirectory } from './utils/filesystem';
import { Tracing } from './middleware/tracing';
import { Authentication } from './middleware/authentication';
import { DecisionTree } from './middleware/decision-tree';

const { readFile } = promises;

plugin(accessibleRecordsPlugin);

(async () => {
  const pkg = JSON.parse((await readFile('./package.json')).toString());
  const { port: serverPort, log } = pkg.config;
  const name = `${pkg.name}@${pkg.version}`;

  const isProduction = process.env.NODE_ENV !== 'development';

  const loggerConfiguration = {
    name: name,
    level: log.level || 'info',
    streams: [
      {
        stream: process.stderr,
      },
    ],
  };

  if (log.filepath) {
    const logDirectory = resolve(dirname(log.filepath));
    ensureDirectory(logDirectory);
    loggerConfiguration.streams.push({
      type: 'rotating-file',
      path: log.filepath,
      period: '1d',
      count: 8,
    } as any);
  }
  const logger = createLogger(loggerConfiguration);
  const accessLogStream = createWriteStream(log.access || 'access.log', {
    flags: 'a',
  });

  const { DATABASE_PASSWORD: password } = process.env;

  const server = express();

  server.set('etag', false);
  server.use(morgan('combined', { stream: accessLogStream }));
  server.use(compression());
  server.use(bodyParser.json({ limit: '200kB' }));

  await connect(pkg.config.database.url, {
    ...pkg.config.database.options,
    auth: {
      ...pkg.config.database.options.auth,
      password,
    },
    dbName: pkg.config.database.name,
  });

  server.use(Tracing(logger) as any);
  server.use(Authentication());
  server.use(DecisionTree(logger));

  require('./api').default(server, pkg.config, logger);
  // const userController = UserController();

  // server.post("/user", userController.create);
  // server.get("/user/:userId", userController.confirm);

  server.listen(serverPort, () => {
    logger.info('%s listening at port %s', name, serverPort);
  });
})();
