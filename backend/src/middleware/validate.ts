import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { sendError } from "../utils/response";

type ValidateTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodTypeAny, target: ValidateTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (result.success) {
      // Put parsed/cleaned data back (zod transforms/coercions apply)
      (req as any)[target] = result.data;
      return next();
    }

    // Zod error -> strict format
    const zerr: ZodError = result.error;
    const errors = zerr.issues.map((issue) => ({
      field: issue.path.length ? issue.path.join(".") : target,
      message: issue.message,
    }));

    return sendError(res, {
      title: "Validation Error",
      message: "Invalid schedule input",
      statusCode: 400,
      errors,
    });
  };
