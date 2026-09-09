import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import dashboardRoutes from "./dashboard.routes";
import studentRoutes from "./student.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/courses", courseRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
