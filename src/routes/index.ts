import { Express } from "express";
import { geminiRoutes } from "./geminiRoutes";

const routes = (server: Express) => {
  geminiRoutes(server);
};

export default routes;
