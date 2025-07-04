import express from "express";
import config from "./config";
import healthcheck from "express-healthcheck";
import logger from "./utils/logger";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import "../src/services/redis";
import { setupWebsockets } from "./services/websockets";

const app = express();
const server = createServer(app);
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
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
  routes(app);
  setupWebsockets(server);
});

export { server };
