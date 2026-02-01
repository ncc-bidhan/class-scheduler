import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  createSingleClassSchema,
  createRecurringClassSchema,
  occurrencesQuerySchema,
} from "../utils/validations";
import * as classController from "../controllers/class.controller";

const router = Router();

router.post(
  "/single",
  validate(createSingleClassSchema),
  classController.createSingleClass,
);
router.post(
  "/recurring",
  validate(createRecurringClassSchema),
  classController.createRecurringClass,
);
router.get(
  "/occurrences",
  validate(occurrencesQuerySchema, "query"),
  classController.getOccurrences,
);
router.get("/:id", classController.getClassById);

export default router;
