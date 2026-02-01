import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import * as classService from "../services/class.service";
import { ServiceError } from "../services/class.service";

export const createSingleClass = async (req: Request, res: Response) => {
  try {
    const newClass = await classService.createSingle(req.body);

    return sendSuccess(res, {
      title: "Class created",
      message: "Single class created successfully",
      data: newClass,
    });
  } catch (err: any) {
    if (err instanceof ServiceError) {
      return sendError(res, {
        title: "Validation Error",
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors,
      });
    }
    throw err;
  }
};

export const createRecurringClass = async (req: Request, res: Response) => {
  try {
    const newClass = await classService.createRecurring(req.body);

    return sendSuccess(res, {
      title: "Class created",
      message: "Recurring class pattern created successfully",
      data: newClass,
    });
  } catch (err: any) {
    if (err instanceof ServiceError) {
      return sendError(res, {
        title: "Validation Error",
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors,
      });
    }
    throw err;
  }
};

export const getOccurrences = async (req: Request, res: Response) => {
  const query = (res.locals.validated?.query ?? req.query) as any;
  const result = await classService.getOccurrences(query);

  return sendSuccess(res, {
    title: "Classes fetched",
    message: "Class list loaded",
    data: result.occurrences,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    },
  });
};

export const getClassById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const classDoc = await classService.getById(Array.isArray(id) ? id[0] : id);

  if (!classDoc) {
    return sendError(res, {
      title: "Not Found",
      message: "Class not found",
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    title: "Class fetched",
    message: "Class details loaded",
    data: classDoc,
  });
};
