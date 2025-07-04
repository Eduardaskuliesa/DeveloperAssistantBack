import { RequestHandler, Request, Response } from "express";
import logger from "../../utils/logger";
import { activeChatSessions } from "./createChat";
import { Chat } from "@google/genai";
import axios from "axios";
import config from "../../config";

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

    const stream = await chat.sendMessageStream({
      message: message,
    });

    let fullResponse = "";
    let usageMetadata = null;

    for await (const chunk of stream) {
      const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
      fullResponse += text;
      if (chunk.usageMetadata) {
        usageMetadata = chunk.usageMetadata;
      }

      res.write(text);
    }

    res.write(`\n\n---METADATA---\n`);
    res.write(
      JSON.stringify({
        tokens: usageMetadata?.totalTokenCount,
        cachedTokens: usageMetadata?.cacheTokensDetails,
        fullMessage: fullResponse,
      })
    );

    res.end();
  } catch (error) {
    logger.error("Error sending message:", error);
    res.status(500).json({
      error: `Internal Server Error: ${error}`,
    });
  }
};
