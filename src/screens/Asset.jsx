import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Card, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { supabase } from "../supabase";
import HomeNav from "../components/HomeNav";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";

const categoryIcons = {
  Property: "🏠",
  Vehicle: "🚗",
  Stocks: "📈",
  Savings: "💰",
  Others: "🔹",
};

const AssetsDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    category: "",
    value: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Error getting user:", authError);
        setLoading(false);
        return;
      }

      // Fetch Asset Distribution for Logged-in User
      const { data: assetsData, error: assetsError } = await supabase
        .from("asset_distribution")
        .select("*")
        .eq("userid", user.id)
        .order("created_at", { ascending: false });

      if (assetsError) {
        console.error("Error fetching assets:", assetsError);
        setLoading(false);
        return;
      }

      setAssets(assetsData);
      setLoading(false);
    };

    fetchAssets();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, value } = formData;

    if (!category || !value) {
      setMessage("Please fill all fields.");
      return;
    }

    setMessage("");

    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Error getting user:", authError);
      return;
    }

    // Insert asset into Supabase
    const { error } = await supabase
      .from("asset_distribution")
      .insert([{
        category,
        value: parseFloat(value),
        userid: user.id,
      }]);

    if (error) {
      console.error("Error inserting asset:", error);
    } else {
      setMessage("Asset added successfully.");
      setFormData({ category: "", value: "" }); // Reset form
      fetchAssets(); // Refresh the asset list
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className={`${darkMode ? "bg-[#0a0f1c] text-white" : "bg-gray-100 text-black"} flex flex-col items-center p-8`}>
        <HomeNav />
      </div>

      {
        loading?(<div className="flex-1 items-center justify-center"><Spinner /></div>):(<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h5" className="text-center text-gray-300 mb-10">
            Your Assets
          </Typography>
  
          {/* Navigate to Add New Asset Page Button */}
          <div className="mt-5 mb-5">
          <Link to="/addassets">
            <Button variant="contained" color="primary" fullWidth className="mb-6">
              Add New Asset
            </Button>
          </Link>
          </div>
  
          {/* Assets Table */}
          <Card className="w-[80%] mt-6 bg-[#0a0f1c] shadow-lg rounded-lg border-2 border-gray-800 overflow-y-auto mb-20">
            {loading ? (
              <Box className="flex justify-center bg-[#0a0f1c]">
                <div className="items-center justify-center py-5"><Spinner /></div>
              </Box>
            ) : assets.length > 0 ? (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-900 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Added Date</th>
                    <th className="py-3 px-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <motion.tr
                      key={asset.id}
                      whileHover={{ scale: 1.02 }}
                      className="border-b border-gray-600 hover:bg-gray-700 bg-[#0a0f1c] transition-all"
                    >
                      <td className="py-4 px-4 text-white">
                        {categoryIcons[asset.category] || "📌"} {asset.category || "Unknown"}
                      </td>
                      <td className="py-4 px-4 text-white">{new Date(asset.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-right text-green-500">₹{asset.value.toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography  className="text-center py-6 bg-[#0a0f1c] text-white">
                No assets found.
              </Typography>
            )}
          </Card>
        </Box>)
      }
    </div>
  );
};

export default AssetsDashboard;
