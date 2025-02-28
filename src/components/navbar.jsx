import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-between items-center px-6 md:px-16 py-4 bg-[#0a0f1c] border-b border-gray-800 shadow-md"
    >
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-400">SpendoSense</div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 text-gray-300">
        <li className="hover:text-blue-400 cursor-pointer transition">Home</li>
        <li className="hover:text-blue-400 cursor-pointer transition">Features</li>
        <li className="hover:text-blue-400 cursor-pointer transition">Pricing</li>
        <li className="hover:text-blue-400 cursor-pointer transition">Testimonials</li>
      </ul>

      {/* Buttons */}
      <div className="hidden md:flex gap-4">
        <Button className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-800" onClick={()=>navigate('/login')}>Login</Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={()=>navigate('/signup')}>Sign Up</Button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden text-gray-300 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={24} />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-[#0a0f1c] border-t border-gray-800 p-6 md:hidden"
        >
          <ul className="flex flex-col gap-4 text-gray-300">
            <li className="hover:text-blue-400 cursor-pointer transition">Home</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Features</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Pricing</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Testimonials</li>
          </ul>
          <div className="flex flex-col gap-4 mt-6">
            <Button className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-800" onClick={()=>navigate('/login')}>Login</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={()=>navigate('/signup')}>Sign Up</Button>
            
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}