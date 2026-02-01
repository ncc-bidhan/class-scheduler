import Branch, { IBranch } from "../models/Branch";

export const createBranch = async (payload: any): Promise<IBranch> => {
  return Branch.create(payload);
};

export const getAllBranches = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ branches: IBranch[]; total: number }> => {
  const skip = (page - 1) * limit;

  const [branches, total] = await Promise.all([
    Branch.find().sort({ name: 1 }).skip(skip).limit(limit),
    Branch.countDocuments(),
  ]);

  return { branches, total };
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
