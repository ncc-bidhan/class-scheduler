import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import * as branchService from "../services/branch.service";

export const createBranch = async (req: Request, res: Response) => {
  const branch = await branchService.createBranch(req.body);
  return sendSuccess(res, {
    title: "Branch created",
    message: "Branch created successfully",
    data: branch,
  });
};

export const getAllBranches = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { branches, total } = await branchService.getAllBranches(page, limit);

  return sendSuccess(res, {
    title: "Branches fetched",
    message: "Branch list loaded",
    data: branches,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getBranchById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const branch = await branchService.getBranchById(
    Array.isArray(id) ? id[0] : id,
  );
  if (!branch) {
    return sendError(res, {
      title: "Not Found",
      message: "Branch not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Branch fetched",
    message: "Branch loaded successfully",
    data: branch,
  });
};

export const updateBranch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const branch = await branchService.updateBranch(
    Array.isArray(id) ? id[0] : id,
    req.body,
  );
  if (!branch) {
    return sendError(res, {
      title: "Not Found",
      message: "Branch not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Branch updated",
    message: "Branch updated successfully",
    data: branch,
  });
};

export const deleteBranch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const branch = await branchService.deleteBranch(
    Array.isArray(id) ? id[0] : id,
  );
  if (!branch) {
    return sendError(res, {
      title: "Not Found",
      message: "Branch not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Branch deleted",
    message: "Branch deleted successfully",
    data: branch,
  });
};
