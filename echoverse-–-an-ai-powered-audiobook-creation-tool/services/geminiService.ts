
import { GoogleGenAI } from "@google/genai";
import { Tone } from "../types";

// Ensure the API key is available, but do not hardcode it.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const rewriteText = async (text: string, tone: Tone): Promise<string> => {
  if (!text.trim()) {
    return Promise.resolve('');
  }

  const prompt = `Rewrite the following text in a ${tone} tone. The output should only be the rewritten text, without any introductory phrases like "Here is the rewritten text:" or any other commentary.

Original Text:
---
${text}
---
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID"))) {
        throw new Error("Your API key is not valid. Please check your configuration and ensure it is correct.");
    }
    throw new Error("Could not connect to the AI service. Please check your network connection and try again later.");
  }
};
