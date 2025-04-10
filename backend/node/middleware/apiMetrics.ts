// middleware/apiMetrics.ts
import { Request, Response, NextFunction } from "express";
import { Counter } from "prom-client";

const apiCallCounter = new Counter({
  name: "api_calls_total",
  help: "Total number of API calls",
  labelNames: ["route", "method", "status"],
});

export const trackApiMetrics = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", () => {
    apiCallCounter.inc({
      route: req.originalUrl, // Now req.path should be the full route
      method: req.method,
      status: String(res.statusCode), // Get the actual status code
    });
  });
  next();
};
