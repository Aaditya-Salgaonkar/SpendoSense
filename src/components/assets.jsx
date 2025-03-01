import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Assuming you have your Supabase client set up
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import IncomeVsExpenses from "./IE"; // Assuming the IncomeVsExpenses component is already created
import { User } from "lucide-react";

const COLORS = [
  "#FF6347", "#FFBB28", "#00C49F", "#0088FE", "#FF8042", "#8A2BE2", "#FF69B4", "#32CD32", "#00CED1", "#FF4500"
]; // Premium color palette for the pie chart

const AssetDistribution = () => {
  const [assetData, setAssetData] = useState([]);
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch asset data function, moved outside useEffect
  const fetchAssetData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Get the authenticated user
      const { data: userData, error: userError } = await supabase.auth._getUser();
  
      if (userError) throw userError;
      if (!userData?.user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }
  
      const userId = userData.user.id;
  
      // Fetch asset data filtered by the logged-in user
      const { data, error } = await supabase
        .from("asset_distribution")
        .select("category, value")
        .eq("userid", userId) // Ensure only this user's data is fetched
        .order("created_at", { ascending: true });
  
      if (error) throw error;
  
      // Format data for the Pie Chart
      const formattedData = data.map((item) => ({
        name: item.category,
        value: item.value,
      }));
  
      console.log("Asset Distribution Data:", formattedData);
      setAssetData(formattedData);
    } catch (error) {
      console.error("Error fetching asset distribution:", error);
      setError("Failed to load asset distribution data.");
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch data on mount
  useEffect(() => {
    fetchAssetData();
  }, []);

  const handleAddAsset = async () => {
    if (!category || !value) {
      alert("Please fill in both fields.");
      return;
    }
  
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("User not authenticated.");
        return;
      }
  
      const userId = userData.user.id;
  
      // Submit asset to Supabase with userId
      const { data, error } = await supabase
        .from("asset_distribution")
        .insert([{ category, value: parseFloat(value), userId }]);
  
      if (error) throw error;
  
      // Clear form and refetch data
      setCategory("");
      setValue("");
      await fetchAssetData();
    } catch (error) {
      console.error("Error adding asset:", error);
      alert("Failed to add asset.");
    }
  };
  

  // Custom Tooltip to show details
  const renderCustomizedTooltip = ({ payload, label }) => {
    if (payload && payload.length > 0) {
      const totalValue = assetData.reduce((acc, item) => acc + item.value, 0);
      const percentage = ((payload[0].value / totalValue) * 100).toFixed(2);
      return (
        <div className="custom-tooltip bg-gray-800 p-3 rounded-lg text-white">
          <p className="text-lg font-semibold">{label}</p>
          <p className="text-sm">Value: {payload[0].value}</p>
          <p className="text-sm">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="text-center text-white">Loading asset distribution...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Asset Distribution PieChart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r text-white">
          Asset Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={assetData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {assetData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderCustomizedTooltip} />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expenses BarChart */}
      <IncomeVsExpenses />
    </div>
  );
};

export default AssetDistribution;
