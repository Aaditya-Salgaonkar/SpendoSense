import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // Use .env variable
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askGemini = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text(); // Extract text response
    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};
