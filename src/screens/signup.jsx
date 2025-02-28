import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      // Sign up user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { fullname: formData.fullname } },
      });

      if (error) throw error;

      // Insert user into freelancer table
      if (data.user) {
        const { error: dbError } = await supabase
          .from("users")
          .upsert({ id: data.user.id, email: formData.email, name: formData.fullname });

        if (dbError) throw dbError;
      }

      alert("Signup successful! Check your email for verification.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] text-white px-6">
      <motion.div 
        className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          Create an Account
        </h2>
        <p className="mt-2 text-gray-400 text-center">Join us and manage your finances effortlessly.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg">
            <FaUser className="text-blue-400" />
            <Input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="bg-transparent text-white outline-none w-full border-gray-700"
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg">
            <FaEnvelope className="text-blue-400" />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent text-white outline-none w-full border-gray-700"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg">
            <FaLock className="text-blue-400" />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent text-white outline-none w-full border-gray-700"
              required
            />
          </div>

          {/* Sign-Up Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </motion.div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-3 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Sign in Link */}
        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
