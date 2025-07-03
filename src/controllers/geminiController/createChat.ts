import googleGenAi from "../../services/geminiAi";
import logger from "../../utils/logger";
import { RequestHandler, Request, Response } from "express";

export const activeChatSessions = new Map();

export const createChat: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const systemInstruction = {
      parts: [
        {
          text: "You are a helpful and concise assistant. Always answer directly and avoid lengthy explanations unless specifically asked. Do not make assumptions. Prioritize clarity and brevity.",
        },
      ],
    };
    const config = {
      temperature: 0.8,
      responseMimeType: "text/plain",
      systemInstruction,
    };
    const chatId = 1;

    const chat = googleGenAi.chats.create({
      model: "gemini-2.0-flash",
      config: config,
    });

    activeChatSessions.set(chatId, chat);

    res.status(200).json({
      chatId,
      message: "Chat created successfully",
    });
  } catch (error) {
    logger.error("Error creating chat:", error);
    res.status(500).json({
      error: `Internal Server Error: ${error}`,
      message: "An error occurred while creating the chat.",
    });
  }
};
