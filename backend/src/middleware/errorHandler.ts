import { Request, Response, NextFunction } from "express";
import { sendError, FieldError } from "../utils/response";

export const notFound = (req: Request, res: Response) => {
  return sendError(res, {
    title: "Not Found",
    message: `Route not found: ${req.originalUrl}`,
    statusCode: 404,
    errors: [],
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  // Mongoose validation error
  if (err?.name === "ValidationError") {
    const errors: FieldError[] = Object.keys(err.errors || {}).map((field) => ({
      field,
      message: err.errors[field]?.message || "Invalid value",
    }));

    return sendError(res, {
      title: "Validation Error",
      message: "Invalid schedule input",
      statusCode: 400,
      errors,
    });
  }

  // Mongoose bad ObjectId
  if (err?.name === "CastError" && err?.kind === "ObjectId") {
    return sendError(res, {
      title: "Not Found",
      message: "Resource not found",
      statusCode: 404,
      errors: [{ field: "id", message: "Invalid resource id" }],
    });
  }

  // Duplicate key error
  if (err?.code === 11000) {
    const key = Object.keys(err.keyValue || {})[0] || "field";
    return sendError(res, {
      title: "Validation Error",
      message: "Duplicate value",
      statusCode: 400,
      errors: [{ field: key, message: `${key} already exists` }],
    });
  }

  return sendError(res, {
    title: "Server Error",
    message: err?.message || "Something went wrong",
    statusCode: err?.statusCode || 500,
    errors: [],
  });
};
