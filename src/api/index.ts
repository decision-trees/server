import { Express, Router } from 'express';
import Logger from 'bunyan';
import passport from 'passport';

import { EntityController } from './controller/EntityController';

export default function setup(server: Express, config: any, logger: Logger) {
  //   const exhibitionController = ExhibitionController();
  //   const exhibitionRouter = new (Router as any)();
  //   exhibitionRouter.get("/", exhibitionController.list);
  //   exhibitionRouter.get("/:id", exhibitionController.read);
  //   server.use("/exhibition", exhibitionRouter);
  //   server.use("/image", imageRouter);
  //   server.use("/upload", uploadImageRouter);
  //   server.use("/user", userRouter);
  const entityController = EntityController();
  const entityRouter = new (Router as any)();

  entityRouter.get('/', entityController.list);
  entityRouter.post('/', entityController.create);
  entityRouter.get('/:id', entityController.read);
  entityRouter.put('/:id', entityController.update);
  entityRouter.delete('/:id', entityController.delete);

  server.use(
    '/api/entity',
    passport.authenticate('jwt', { session: false }),
    entityRouter
  );
}
