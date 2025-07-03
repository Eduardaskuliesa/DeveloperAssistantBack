import { GoogleGenAI } from "@google/genai";
import config from "../config";

const googleGenAi = new GoogleGenAI({
  apiKey: config.googleGemini.apiKey,
});

export default googleGenAi;
