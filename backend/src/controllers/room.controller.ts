import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import * as roomService from "../services/room.service";

export const createRoom = async (req: Request, res: Response) => {
  const room = await roomService.createRoom(req.body);
  return sendSuccess(res, {
    title: "Room created",
    message: "Room created successfully",
    data: room,
  });
};

export const getAllRooms = async (req: Request, res: Response) => {
  const branchId = req.query.branchId as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { rooms, total } = await roomService.getAllRooms(branchId, page, limit);

  return sendSuccess(res, {
    title: "Rooms fetched",
    message: "Room list loaded",
    data: rooms,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getRoomById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const room = await roomService.getRoomById(Array.isArray(id) ? id[0] : id);
  if (!room) {
    return sendError(res, {
      title: "Not Found",
      message: "Room not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Room fetched",
    message: "Room loaded successfully",
    data: room,
  });
};

export const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const room = await roomService.updateRoom(
    Array.isArray(id) ? id[0] : id,
    req.body,
  );
  if (!room) {
    return sendError(res, {
      title: "Not Found",
      message: "Room not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Room updated",
    message: "Room updated successfully",
    data: room,
  });
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const room = await roomService.deleteRoom(Array.isArray(id) ? id[0] : id);
  if (!room) {
    return sendError(res, {
      title: "Not Found",
      message: "Room not found",
      statusCode: 404,
    });
  }
  return sendSuccess(res, {
    title: "Room deleted",
    message: "Room deleted successfully",
    data: room,
  });
};
