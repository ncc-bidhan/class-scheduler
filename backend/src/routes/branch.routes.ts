import { Router } from "express";
import { validate } from "../middleware/validate";
import { branchSchema } from "../utils/validations";
import * as branchController from "../controllers/branch.controller";

const router = Router();

router.post("/", validate(branchSchema), branchController.createBranch);
router.get("/", branchController.getAllBranches);
router.get("/:id", branchController.getBranchById);
router.put("/:id", validate(branchSchema), branchController.updateBranch);
router.delete("/:id", branchController.deleteBranch);

export default router;
