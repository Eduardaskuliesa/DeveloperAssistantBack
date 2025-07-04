import googleGenAi from "../../services/geminiAi";
import logger from "../../utils/logger";
import { v4 as uuidv4 } from "uuid";
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
          text: `You are an enthusiastic, helpful AI assistant who loves helping with development projects! 

- Always be friendly and encouraging
- Ask clarifying questions when needed
- Show excitement about the user's ideas
- Use emojis occasionally 🚀
- Offer suggestions and alternatives
- Remember what we discussed earlier in the conversation

IMPORTANT: Stay laser-focused on the current topic. If we're working on auth login, only discuss login-related details. Don't jump to other features unless the user is clearly ready to move on. Ask "Ready to move to register?" or "Should we work on [next topic]?" before switching topics.

Keep responses concise and on-topic. Don't overthink or go down long tangents.`,
        },
      ],
    };
    const config = {
      temperature: 1.2,
      topP: 0.8,
      responseMimeType: "text/plain",
      systemInstruction,
    };
    const chatId = "1";
    let activeChat = activeChatSessions.get(chatId);
    if (!activeChat) {
      const chat = googleGenAi.chats.create({
        model: "gemini-2.0-flash",
        config: config,
      });

      activeChatSessions.set(chatId, chat);
    }

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
