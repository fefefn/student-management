import { Router } from "express";
import * as courseController from "../controllers/course.controller";
import { protect } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { createCourseSchema, updateCourseSchema } from "../validators/course.validator";

const router = Router();

router.use(protect); // every course route requires authentication

router.route("/").get(courseController.getCourses).post(validateBody(createCourseSchema), courseController.createCourse);

router
  .route("/:id")
  .get(courseController.getCourse)
  .put(validateBody(updateCourseSchema), courseController.updateCourse)
  .delete(courseController.deleteCourse);

export default router;
