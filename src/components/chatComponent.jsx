import { useState } from "react";
import { askGemini } from "../api/geminiService";

const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return; // Prevent empty submission

    const aiResponse = await askGemini(prompt);
    console.log(aiResponse);
    setResponse(aiResponse || "Error getting response.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 bg-[#0a0f1c]">
      <div className="bg-green-400 shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-4">Ask Gemini</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
          <input
            className="w-full p-3 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question here..."
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Submit
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm shadow-gray-400">
            <h3 className="text-lg font-semibold text-green-700">Response:</h3>
            <p className="text-gray-800 mt-2">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
