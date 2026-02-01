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
  const rooms = await roomService.getAllRooms(branchId);
  return sendSuccess(res, {
    title: "Rooms fetched",
    message: "Room list loaded",
    data: rooms,
  });
};

export const getRoomById = async (req: Request, res: Response) => {
  const room = await roomService.getRoomById(req.params.id as string);
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
  const room = await roomService.updateRoom(req.params.id as string, req.body);
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
  const room = await roomService.deleteRoom(req.params.id as string);
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
