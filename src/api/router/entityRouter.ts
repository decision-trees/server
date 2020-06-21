import { Router } from 'express';
import { EntityController } from '../controller/entityController';

export default function entityRouter() {
  const entityController = EntityController();
  const entityRouter = new (Router as any)();

  entityRouter.get('/', entityController.list);
  entityRouter.post('/', entityController.create);
  entityRouter.get('/:id', entityController.read);
  entityRouter.put('/:id', entityController.update);
  entityRouter.delete('/:id', entityController.delete);
  return entityRouter;
}
