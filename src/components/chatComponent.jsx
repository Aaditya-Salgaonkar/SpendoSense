import { useState, useEffect } from "react";
import { askGemini } from "../api/geminiService";
import { supabase } from "../supabase";
import ReactMarkdown from "react-markdown";

const ChatComponent = () => {
  const [response, setResponse] = useState("");
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    fetchUserAnalysis();
  }, []);

  const fetchUserAnalysis = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Error fetching user ID:", authError);
      return;
    }

    const currentUserId = user.id;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("monthlyincome")
      .eq("id", currentUserId)
      .single();

    if (userError || !userData) {
      console.error("Error fetching monthly income:", userError);
      return;
    }

    const monthlyIncome = userData.monthlyincome;

    const unnecessaryCategories = ["Entertainment", "Shopping", "Food"];
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .in("name", unnecessaryCategories);

    if (categoryError || !categoryData) {
      console.error("Error fetching categories:", categoryError);
      return;
    }

    const categoryMapObject = {};
    categoryData.forEach((category) => {
      categoryMapObject[category.id] = category.name;
    });

    const categoryIds = categoryData.map((category) => category.id);
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select("amount, categoryid")
      .eq("userid", currentUserId)
      .in("categoryid", categoryIds);

    if (transactionsError || !transactionsData) {
      console.error("Error fetching transactions:", transactionsError);
      return;
    }

    let totalUnnecessaryExpense = 0;
    const unnecessaryExpenses = transactionsData.reduce((acc, transaction) => {
      const categoryName = categoryMapObject[transaction.categoryid] || "Other";
      if (!acc[categoryName]) {
        acc[categoryName] = { totalSpent: 0, percentage: 0 };
      }
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
      userId: currentUserId,
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
    console.log(aiResponse);
    setResponse(aiResponse || "Error getting response.");
  };

  return (
    <div className="p-24">
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#0a0f1c]   ">
      <div className="bg-green-400 shadow-lg rounded-xl p-6 w-full border-white border ">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-4">
          SpendoSense AI Analysis
        </h2>
        {response ? (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm shadow-gray-400">
            <h3 className="text-lg font-semibold text-green-700">Analysis:</h3>
            <ReactMarkdown components={{ p: ({ node, ...props }) => <p className="text-gray-800 mt-2" {...props} /> }}>
  {response}
</ReactMarkdown>
          </div>
           
        ) : (
          <p className="text-center text-green-700">Analyzing your expenses...</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default ChatComponent;