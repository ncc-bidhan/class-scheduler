import Branch, { IBranch } from "../models/Branch";

export const createBranch = async (payload: any): Promise<IBranch> => {
  return Branch.create(payload);
};

export const getAllBranches = async (): Promise<IBranch[]> => {
  return Branch.find().sort({ name: 1 });
};

export const getBranchById = async (id: string): Promise<IBranch | null> => {
  return Branch.findById(id);
};

export const updateBranch = async (id: string, payload: any): Promise<IBranch | null> => {
  return Branch.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteBranch = async (id: string): Promise<IBranch | null> => {
  return Branch.findByIdAndDelete(id);
};
