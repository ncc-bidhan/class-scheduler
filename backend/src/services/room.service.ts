import Room, { IRoom } from "../models/Room";

export const createRoom = async (payload: any): Promise<IRoom> => {
  return Room.create(payload);
};

export const getAllRooms = async (
  branchId?: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ rooms: IRoom[]; total: number }> => {
  const filter = branchId ? { branchId } : {};
  const skip = (page - 1) * limit;

  const [rooms, total] = await Promise.all([
    Room.find(filter)
      .populate("branchId", "name")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Room.countDocuments(filter),
  ]);

  return { rooms, total };
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
