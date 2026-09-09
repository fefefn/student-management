import { Router } from "express";
import * as studentController from "../controllers/student.controller";
import { protect } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { createStudentSchema, updateStudentSchema } from "../validators/student.validator";

const router = Router();

router.use(protect); // every student route requires authentication

router
  .route("/")
  .get(studentController.getStudents)
  .post(validateBody(createStudentSchema), studentController.createStudent);

router
  .route("/:id")
  .get(studentController.getStudent)
  .put(validateBody(updateStudentSchema), studentController.updateStudent)
  .delete(studentController.deleteStudent);

export default router;
