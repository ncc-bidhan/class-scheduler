import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { sendError } from "../utils/response";

type ValidateTarget = "body" | "query" | "params";

declare global {
  namespace Express {
    interface Locals {
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export const validate =
  (schema: ZodTypeAny, target: ValidateTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate =
      target === "body"
        ? req.body
        : target === "query"
          ? req.query
          : req.params;

    const result = schema.safeParse(dataToValidate);

    if (result.success) {
      if (target === "body") {
        req.body = result.data;
      } else {
        res.locals.validated = res.locals.validated || {};
        res.locals.validated[target] = result.data;
      }
      return next();
    }

    const errors = result.error.issues.map((issue) => ({
      field: issue.path.length ? issue.path.join(".") : target,
      message: issue.message,
    }));

    return sendError(res, {
      title: "Validation Error",
      message: "Invalid input provided",
      statusCode: 400,
      errors,
    });
  };
