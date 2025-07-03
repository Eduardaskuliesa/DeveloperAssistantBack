import { RequestHandler, Request, Response } from "express";
import logger from "../../utils/logger";
import { activeChatSessions } from "./createChat";
import { Chat } from "@google/genai";

export const sendMessage: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { chatId, message } = req.body;
    if (!chatId || !message) {
      res.status(400).json({
        error: "Chat ID and message are required.",
      });
      return;
    }
    const chat: Chat = activeChatSessions.get(chatId);

    if (!chat) {
      res.status(404).json({
        error: "Chat not found. Please create a chat first.",
      });
      return;
    }
    const response = await chat.sendMessage({
      message: message,
    });

    const messageResponse = response?.candidates[0]?.content?.parts[0]?.text;
    const tokens = response.usageMetadata?.totalTokenCount;
    const cachedTokens = response.usageMetadata?.cacheTokensDetails;

    console.log(JSON.stringify(response, null, 2), "Response from Google AI");

    res.status(200).json({
      message: messageResponse,
      tokens: tokens,
      cachedTokens: cachedTokens,
    });
  } catch (error) {
    logger.error("Error sending message:", error);
    res.status(500).json({
      error: `Internal Server Error: ${error}`,
    });
  }
};
