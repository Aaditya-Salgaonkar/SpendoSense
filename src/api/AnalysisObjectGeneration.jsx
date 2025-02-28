import { supabase } from "@/supabase";

const generateAnalysisInput = async (supabase) => {
    // 1️⃣ Fetch the logged-in user's ID
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
  
    if (authError || !user) {
      console.error("Error fetching user ID:", authError);
      return null;
    }
  
    const currentUserId = user.id; // Extract user ID
  
    // 2️⃣ Fetch the logged-in user's monthly income
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("monthlyincome")
      .eq("id", currentUserId)
      .single();
  
    if (userError || !userData) {
      console.error("Error fetching monthly income:", userError);
      return null;
    }
  
    const monthlyIncome = userData.monthlyincome;
  
    // 3️⃣ Fetch all unnecessary categories (Entertainment, Shopping, Food, etc.)
    const unnecessaryCategories = ["Entertainment", "Shopping", "Food"];
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .in("name", unnecessaryCategories);
  
    if (categoryError || !categoryData) {
      console.error("Error fetching categories:", categoryError);
      return null;
    }
  
    // 🔹 Build category map dynamically from database (UUID → category name)
    const categoryMapObject = {};
    categoryData.forEach((category) => {
      categoryMapObject[category.id] = category.name;
    });
  
    // 4️⃣ Fetch transactions where category_id is in the unnecessary category list
    const categoryIds = categoryData.map((category) => category.id);
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select("amount, categoryid")
      .eq("userid", currentUserId)
      .in("categoryid", categoryIds);
  
    if (transactionsError || !transactionsData) {
      console.error("Error fetching transactions:", transactionsError);
      return null;
    }
  
    // 🔥 Aggregate Transactions by Category (Sum Total Amounts)
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
  
    // 🔹 Calculate percentage of monthly income
    Object.keys(unnecessaryExpenses).forEach((categoryName) => {
      unnecessaryExpenses[categoryName].percentage = (
        (unnecessaryExpenses[categoryName].totalSpent / monthlyIncome) * 100
      ).toFixed(2);
    });
  
    // 📌 Create final object to pass to Gemini
    const analysisInput = {
      userId: currentUserId,
      monthlyIncome,
      totalUnnecessaryExpense,
      unnecessaryExpenses,
    };
  
    return analysisInput;
  };
  