import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import * as instructorService from "../services/instructor.service";

export const createInstructor = async (req: Request, res: Response) => {
  const instructor = await instructorService.createInstructor(req.body);
  return sendSuccess(res, {
    title: "Instructor created",
    message: "Instructor created successfully",
    data: instructor,
  });
};

export const getAllInstructors = async (req: Request, res: Response) => {
  const branchId = req.query.branchId as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { instructors, total } = await instructorService.getAllInstructors(
    branchId,
    page,
    limit,
  );

  return sendSuccess(res, {
    title: "Instructors fetched",
    message: "Instructor list loaded",
    data: instructors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getInstructorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const instructor = await instructorService.getInstructorById(
    Array.isArray(id) ? id[0] : id,
  );
  if (!instructor) {
    return sendError(res, {
      title: "Not Found",
      message: "Instructor not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Instructor fetched",
    message: "Instructor loaded successfully",
    data: instructor,
  });
};

export const updateInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const instructor = await instructorService.updateInstructor(
    Array.isArray(id) ? id[0] : id,
    req.body,
  );
  if (!instructor) {
    return sendError(res, {
      title: "Not Found",
      message: "Instructor not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Instructor updated",
    message: "Instructor updated successfully",
    data: instructor,
  });
};

export const deleteInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const instructor = await instructorService.deleteInstructor(
    Array.isArray(id) ? id[0] : id,
  );
  if (!instructor) {
    return sendError(res, {
      title: "Not Found",
      message: "Instructor not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Instructor deleted",
    message: "Instructor deleted successfully",
    data: instructor,
  });
};
