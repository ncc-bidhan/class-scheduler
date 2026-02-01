import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";

export const createSingleClass = async (req: Request, res: Response) => {
  return sendSuccess(res, {
    title: "Class created",
    message: "Single class created successfully (mock)",
    data: req.body,
  });
};

export const createRecurringClass = async (req: Request, res: Response) => {
  return sendSuccess(res, {
    title: "Class created",
    message: "Recurring class pattern created successfully (mock)",
    data: req.body,
  });
};

export const getOccurrences = async (req: Request, res: Response) => {
  return sendSuccess(res, {
    title: "Classes fetched",
    message: "Class list loaded",
    data: {
      query: req.query,
      occurrences: [],
    },
  });
};
