import cors from "cors";
import express from "express";
import { env, isDevelopment } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import routes from "./routes";

const app = express();

// --- Global middleware ---
app.use(cors({ origin: env.clientUrls, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (isDevelopment) app.use(requestLogger);

// --- Routes ---
app.get("/", (_req, res) => {
  res.json({ success: true, message: "Student Management System API", health: "/api/health" });
});
app.use("/api", routes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
