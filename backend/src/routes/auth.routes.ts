import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/profile", protect, authController.getProfile);

export default router;
