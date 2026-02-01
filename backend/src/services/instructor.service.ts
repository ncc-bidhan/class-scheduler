import Instructor, { IInstructor } from "../models/Instructor";

export const createInstructor = async (payload: any): Promise<IInstructor> => {
  return Instructor.create(payload);
};

export const getAllInstructors = async (branchId?: string): Promise<IInstructor[]> => {
  const filter = branchId ? { branchIds: branchId } : {};
  return Instructor.find(filter).sort({ name: 1 });
};

export const getInstructorById = async (id: string): Promise<IInstructor | null> => {
  return Instructor.findById(id);
};

export const updateInstructor = async (id: string, payload: any): Promise<IInstructor | null> => {
  return Instructor.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteInstructor = async (id: string): Promise<IInstructor | null> => {
  return Instructor.findByIdAndDelete(id);
};
