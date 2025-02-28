import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // Use .env variable
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askGemini = async (userPrompt) => {
  try {
    const systemPrompt = `
      You are an AI assistant for the website 'SpendoSense'.
      Answer questions only based on the content available on the website. If someone asks financial, spending or data analysis related questions do reply by performing anaylsis and giving tips. Do not leak user Id on the websites. Just go through the data and give practical tips to improve and also alternate investment avenues. If contents about website or details related to spendosyne or any questions related to finance expense assets and productivity are asked. 
      If you do not know the answer, reply with 'I'm sorry, but I can only answer questions related to SpendoSense But if the question is about Finance Productivity and expense management then answer it. Spendosense is made to be more of an expense tracking system with automatic recording solid insights and good data visualization powered by SpendoSense AI. Try to answer generalise questions if they are within our applications domain without mentioning us'
    `;

    const fullPrompt = `${systemPrompt}\n\nUser Query: ${userPrompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text(); // Extract text response
    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};
