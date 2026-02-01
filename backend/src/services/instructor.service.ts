import Instructor, { IInstructor } from "../models/Instructor";

export const createInstructor = async (payload: any): Promise<IInstructor> => {
  return Instructor.create(payload);
};

export const getAllInstructors = async (
  branchId?: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ instructors: IInstructor[]; total: number }> => {
  const filter = branchId ? { branchIds: branchId } : {};
  const skip = (page - 1) * limit;

  const [instructors, total] = await Promise.all([
    Instructor.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Instructor.countDocuments(filter),
  ]);

  return { instructors, total };
};

export const getInstructorById = async (id: string): Promise<IInstructor | null> => {
  return Instructor.findById(id).populate("branchIds", "name");
};

export const updateInstructor = async (id: string, payload: any): Promise<IInstructor | null> => {
  return Instructor.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteInstructor = async (id: string): Promise<IInstructor | null> => {
  return Instructor.findByIdAndDelete(id);
};
