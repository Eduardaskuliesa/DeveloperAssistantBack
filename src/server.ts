import express from "express";
import config from "./config";
import healthcheck from "express-healthcheck";
import logger from "./utils/logger";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import "../src/services/redis";

const server = express();
server.use(morgan("dev"));
server.use(express.json());

server.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

server.use(
  "/health",
  healthcheck({
    healthy: () => ({
      uptime: process.uptime(),
      message: "OK",
      timestamp: new Date().toISOString(),
    }),
  })
);

server.listen(config.server.port, () => {
  logger.info(
    `🚀 Server running on: http://${config.server.domain}:${config.server.port}`
  );
  routes(server);
});
