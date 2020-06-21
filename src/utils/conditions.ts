import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  ErrorRequestHandler,
} from "express";

export function IfAccept(contentType: string, ...handlers: Function[]) {
  return async (req: Request, res: Response, done: NextFunction) => {
    if (req.get("Accept") === contentType) {
      let idx = 0;

      const next = (err?: any) => {
        // signal to exit route
        if (err && err === "route") {
          return done();
        }

        // signal to exit router
        if (err && err === "router") {
          return done(err);
        }

        var layer = handlers[idx++];
        if (!layer) {
          return done(err);
        }

        if (err) {
          layer(err, req, res, next);
        } else {
          layer(req, res, next);
        }
      };
      next();
    } else {
      return done();
    }
  };
}
