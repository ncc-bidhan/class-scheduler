import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";
import * as classService from "../services/class.service";

export const createSingleClass = async (req: Request, res: Response) => {
  const newClass = await classService.createSingle(req.body);

  return sendSuccess(res, {
    title: "Class created",
    message: "Single class created successfully",
    data: newClass,
  });
};

export const createRecurringClass = async (req: Request, res: Response) => {
  const newClass = await classService.createRecurring(req.body);

  return sendSuccess(res, {
    title: "Class created",
    message: "Recurring class pattern created successfully",
    data: newClass,
  });
};

export const getOccurrences = async (req: Request, res: Response) => {
  const occurrences = await classService.getOccurrences(req.query as any);

  return sendSuccess(res, {
    title: "Classes fetched",
    message: "Class list loaded",
    data: occurrences,
  });
};
