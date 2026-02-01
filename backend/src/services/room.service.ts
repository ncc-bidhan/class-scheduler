import Room, { IRoom } from "../models/Room";

export const createRoom = async (payload: any): Promise<IRoom> => {
  return Room.create(payload);
};

export const getAllRooms = async (branchId?: string): Promise<IRoom[]> => {
  const filter = branchId ? { branchId } : {};
  return Room.find(filter).sort({ name: 1 });
};

export const getRoomById = async (id: string): Promise<IRoom | null> => {
  return Room.findById(id);
};

export const updateRoom = async (id: string, payload: any): Promise<IRoom | null> => {
  return Room.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteRoom = async (id: string): Promise<IRoom | null> => {
  return Room.findByIdAndDelete(id);
};
