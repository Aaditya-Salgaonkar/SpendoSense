import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 500); // Add a slight delay to ensure session storage is updated
    }
  }, [navigate]);
  

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
  
      if (error) throw error;
  
      if (data?.session) {
        console.log("Login Successful!", data.session);
  
        sessionStorage.setItem("token", data.session.access_token);
  
        alert("Login successful! Redirecting...");
        
        setTimeout(() => {
          navigate("/dashboard");
          window.location.reload(); // Force refresh to ensure token update
        }, 1000);
      } else {
        throw new Error("Authentication failed. No session found.");
      }
    } catch (error) {
      alert(error.message);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center px-6 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mt-20"
      >
        <Card className="p-8 bg-gray-900 shadow-lg rounded-xl">
          <CardContent>
            <h2 className="text-3xl font-bold text-center text-blue-400">Welcome Back</h2>
            <p className="text-gray-400 text-center">Log in to access your dashboard</p>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label className="text-gray-300 text-sm">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-lg w-full"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-gray-300 text-sm">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-lg w-full"
                  required
                />
              </div>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg w-full rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
            </form>

            {/* Sign up Link */}
            <p className="text-center text-gray-400 mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
