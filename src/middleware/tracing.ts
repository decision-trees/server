import Logger from "bunyan";
import { Response, NextFunction } from "express";
import { v4 } from "uuid";

import { wrapLogger } from "../utils/logger";
import { Request } from "../utils/express";
import { ANONYMOUS_ABILITY } from "../utils/abilities";

export function Tracing(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const traceId = req.get("X-Trace-Id") || v4();
    req.traceId = traceId;
    req.logger = wrapLogger(traceId, logger);
    req.logger.debug({ headers: req.headers }, "Handling request");
    res.set("X-Trace-Id", traceId);
    res.on("finish", () => {
      req.logger.debug({ runtime: Date.now() - start }, "Request is handled.");
    });
    next();
  };
}
