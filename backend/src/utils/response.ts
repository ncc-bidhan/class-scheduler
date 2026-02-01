import { Response } from "express";

export type FieldError = {
  field: string;
  message: string;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SuccessResponse<T> = {
  title: string;
  message: string;
  data: T;
  pagination?: Pagination;
};

export type ErrorResponse = {
  title: string;
  message: string;
  errors: FieldError[];
};

export const sendSuccess = <T>(
  res: Response,
  params: {
    title: string;
    message: string;
    data: T;
    statusCode?: number;
    pagination?: Pagination;
  },
) => {
  const payload: SuccessResponse<T> = {
    title: params.title,
    message: params.message,
    data: params.data,
    ...(params.pagination ? { pagination: params.pagination } : {}),
  };

  return res.status(params.statusCode ?? 200).json(payload);
};

export const sendError = (
  res: Response,
  params: {
    title: string;
    message: string;
    statusCode?: number;
    errors?: FieldError[];
  },
) => {
  const payload: ErrorResponse = {
    title: params.title,
    message: params.message,
    errors: params.errors ?? [],
  };

  return res.status(params.statusCode ?? 500).json(payload);
};
