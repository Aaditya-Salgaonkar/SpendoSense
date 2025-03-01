import { useState, useEffect } from "react";
import { askGemini } from "../api/geminiService";
import { supabase } from "../supabase";
import ReactMarkdown from "react-markdown";
import Spinner from "./Spinner";

const ChatComponent = () => {
  const [response, setResponse] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    fetchUserAnalysis();
  }, []);

  useEffect(() => {
    if (response) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < response.length) {
          setDisplayedText((prev) => prev + response[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 3); // Adjust speed (milliseconds per letter)
      return () => clearInterval(interval);
    }
  }, [response]);

  const fetchUserAnalysis = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return console.error("Error fetching user ID:", authError);

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("monthlyincome")
      .eq("id", user.id)
      .single();
    
    if (userError || !userData) return console.error("Error fetching income:", userError);

    const monthlyIncome = userData.monthlyincome;
    const unnecessaryCategories = ["Entertainment", "Shopping", "Food"];
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .in("name", unnecessaryCategories);

    if (categoryError || !categoryData) return console.error("Error fetching categories:", categoryError);

    const categoryMap = categoryData.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.name }), {});
    const categoryIds = categoryData.map((cat) => cat.id);

    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select("amount, categoryid")
      .eq("userid", user.id)
      .in("categoryid", categoryIds);

    if (transactionsError || !transactionsData) return console.error("Error fetching transactions:", transactionsError);

    let totalUnnecessaryExpense = 0;
    const unnecessaryExpenses = transactionsData.reduce((acc, transaction) => {
      const categoryName = categoryMap[transaction.categoryid] || "Other";
      acc[categoryName] = acc[categoryName] || { totalSpent: 0, percentage: 0 };
      acc[categoryName].totalSpent += transaction.amount;
      totalUnnecessaryExpense += transaction.amount;
      return acc;
    }, {});

    Object.keys(unnecessaryExpenses).forEach((categoryName) => {
      unnecessaryExpenses[categoryName].percentage = (
        (unnecessaryExpenses[categoryName].totalSpent / monthlyIncome) * 100
      ).toFixed(2);
    });

    const analysisData = {
      userId: user.id,
      monthlyIncome,
      totalUnnecessaryExpense,
      unnecessaryExpenses,
    };
    setAnalysisData(analysisData);
    analyzeSpending(analysisData);
  };

  const analyzeSpending = async (data) => {
    const aiResponse = await askGemini(
      `Analyze this user's spending pattern: ${JSON.stringify(data)}`
    );
    setResponse(aiResponse || "Error getting response.");
  };

  return (
    <div className="px-24">
      <div className="flex flex-col items-center justify-center  px-4 bg-[#0a0f1c]">
        <div className="bg-[#0a0f1c] shadow-lg rounded-xl p-6 w-full border-white border">
          <h2 className="text-2xl font-semibold text-center text-white-700 mb-4">
            SpendoSense AI Analysis
          </h2>
          {response ? (
            <div className="mt-6 p-4  rounded-lg border border-gray-300 shadow-sm shadow-gray-400">
              <h3 className="text-lg font-semibold text-white">Analysis:</h3>
              <ReactMarkdown components={{ p: ({ node, ...props }) => <p className=" mt-2" {...props} /> }}>
                {displayedText}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex-1 items-center justify-center">
<Spinner />
<p className="text-center text-white">Analyzing your expenses...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;