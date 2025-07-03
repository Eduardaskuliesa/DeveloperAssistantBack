import IORedis, { RedisOptions } from "ioredis";
import config from "../config";
import logger from "../utils/logger";

const redisOptions: RedisOptions = {
  host: config.redis.host,
  port: Number(config.redis.port),
  enableReadyCheck: true,
  maxRetriesPerRequest: null,
  connectTimeout: 10000,
  keepAlive: 30000,
};

export const redis = new IORedis(redisOptions);

redis.on("connect", () => {
  logger.info("🔗 Connected to Redis");
});

redis.on("ready", () => {
  logger.info("✅ Redis is ready to receive commands");
});

redis.on("error", (err) => {
  logger.error("❌ Redis connection error:", err);
});
