import { Router, Express } from "express";
import geminiController from "../controllers/geminiController";

const router = Router();

export const geminiRoutes = async (server: Express) => {
  server.post("/api/gemini/chat-create", geminiController.createChat);
  server.post("/api/gemini/chat-send", geminiController.sendMessage);
};

export default router;
