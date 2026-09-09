import dotenv from "dotenv";

dotenv.config();

/** Reads a required environment variable or fails fast with a helpful message. */
const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${key}". Copy .env.example to .env and fill it in.`
    );
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  /** One or more allowed frontend origins, comma-separated. */
  clientUrls: (process.env.CLIENT_URL ?? "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
};

export const isDevelopment = env.nodeEnv === "development";
