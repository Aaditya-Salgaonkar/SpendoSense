import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Adjust path if needed

const ExpenseAnalyzer = () => {
  const [userId, setUserId] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [categoryMap, setCategoryMap] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [flaggedCategories, setFlaggedCategories] = useState([]);
  const [goodCategories, setGoodCategories] = useState([]); // ✅ New state for good categories
  const [loading, setLoading] = useState(true);

  // ✅ Hardcoded "Good" Categories (Only these will be considered)
  const goodCategoryNames = ["Healthcare", "Education", "Investments", "Self-Development"];

  useEffect(() => {
    const fetchExpenseData = async () => {
      setLoading(true);

      // 1️⃣ Get Logged-in User
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }
      const currentUserId = userData.user.id;
      setUserId(currentUserId);

      // 2️⃣ Fetch Monthly Income
      const { data: userIncomeData, error: incomeError } = await supabase
        .from("users")
        .select("monthlyincome")
        .eq("id", currentUserId)
        .single();

      if (incomeError || !userIncomeData) {
        console.error("Error fetching income:", incomeError);
        setLoading(false);
        return;
      }
      setMonthlyIncome(userIncomeData.monthlyincome);

      // 3️⃣ Fetch Category Names (ID → Name Mapping)
      const { data: categoriesData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name");

      if (categoryError || !categoriesData) {
        console.error("Error fetching categories:", categoryError);
        setLoading(false);
        return;
      }

      // Create a category ID → Name map
      const categoryMapping = {};
      categoriesData.forEach((category) => {
        categoryMapping[category.id] = category.name;
      });
      setCategoryMap(categoryMapping);

      // 4️⃣ Fetch Transactions for the User
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("categoryid, amount")
        .eq("userid", currentUserId);

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
        setLoading(false);
        return;
      }

      // 5️⃣ Aggregate Expenses by Category
      const categoryExpenses = {};
      transactionsData.forEach((transaction) => {
        const categoryId = transaction.categoryid;
        if (!categoryExpenses[categoryId]) {
          categoryExpenses[categoryId] = 0;
        }
        categoryExpenses[categoryId] += transaction.amount;
      });

      // Convert aggregated data to displayable format
      const expenseList = Object.keys(categoryExpenses).map((categoryId) => ({
        category: categoryMapping[categoryId] || `Category ${categoryId}`,
        spent: categoryExpenses[categoryId],
        percentage: ((categoryExpenses[categoryId] / userIncomeData.monthlyincome) * 100).toFixed(2),
      }));

      setExpenses(expenseList);

      // 6️⃣ Flag Categories Where Spending > 30% of Income
      const flagged = expenseList.filter((expense) => expense.percentage > 30);
      setFlaggedCategories(flagged);

      // 7️⃣ Identify Good Categories (Spending < 20% of Income and in predefined list)
      const good = expenseList.filter(
        (expense) => expense.percentage < 20 && goodCategoryNames.includes(expense.category)
      );
      setGoodCategories(good);

      setLoading(false);
    };

    fetchExpenseData();
  }, []);

  return (
    <div className="bg-gray-900 p-5 rounded-lg shadow-sm shadow-white text-white w-1/2 border border-white">
      <h2 className="text-xl font-bold mb-4 text-center">Expense Analyzer</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-4 text-green-500">Total Monthly Income: ₹{monthlyIncome}</p>

          {/* ⚠️ Flagged Categories (Overspending) */}
          <h3 className="text-lg font-semibold">⚠️ Categories Where You Should Cut Expenses:</h3>
          {flaggedCategories.length === 0 ? (
            <p className="text-green-400">Great! No category exceeds 30% of your income. 🎉</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-4">
              {flaggedCategories.map((expense, index) => (
                <div key={index} className="bg-red-300/10 p-4 rounded-lg border border-red-500 shadow-md hover:bg-red-500">
                  <h4 className="text-red-400 text-lg font-semibold">{expense.category}</h4>
                  <p>Spent: ₹{expense.spent}</p>
                  <p>({expense.percentage}% of income)</p>
                </div>
              ))}
            </div>
          )}

          {/* ✅ Good Categories (Encourage Spending) */}
          <h3 className="text-lg font-semibold mt-6">✅ Areas to Spend More:</h3>
          {goodCategories.length === 0 ? (
            <p className="text-yellow-400">You're not under-spending in key areas.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-4">
              {goodCategories.map((expense, index) => (
                <div key={index} className="bg-green-300/10 p-4 rounded-lg border border-green-500 shadow-md hover:bg-green-600">
                  <h4 className="text-green-400 text-lg font-semibold">{expense.category}</h4>
                  <p>Spent: ₹{expense.spent}</p>
                  <p>({expense.percentage}% of income)</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseAnalyzer;