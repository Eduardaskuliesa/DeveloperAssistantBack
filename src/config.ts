import * as dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = {
  SERVER_DOMAIN: process.env.SERVER_DOMAIN,
  SERVER_PORT: process.env.SERVER_PORT,
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
} as const;

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables:\n${missingVars
      .map((variable) => `  - ${variable}`)
      .join(
        "\n"
      )}\n\nPlease check your .env file and ensure all required variables are defined.`
  );
}

const config = {
  server: {
    domain: process.env.SERVER_DOMAIN!,
    port: process.env.SERVER_PORT!,
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  convex: {
    url: process.env.CONVEX_URL || "http://localhost:3000",
  },
  googleGemini: {
    apiKey: process.env.GOOGLE_GEMINI_API_KEY || "",
  },
} as const;

export default config;
