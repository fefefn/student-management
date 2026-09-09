import app from "./app";
import { connectDB, disconnectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  process.exit(1);
});

startServer();
