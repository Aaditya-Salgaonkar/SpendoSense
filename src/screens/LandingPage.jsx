import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FaApple,
  FaGooglePlay,
  FaChartLine,
  FaUserShield,
  FaRobot,
} from "react-icons/fa";
import { Image } from "@mui/icons-material";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center px-6 md:px-16">
      <Navbar />
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-6xl py-12 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          The Future of Smart Finance
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Automate your financial planning with AI-driven insights and real-time
          analytics.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <Button className="px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
          <Button className="px-6 py-3 text-lg border border-blue-500 text-blue-400 hover:bg-blue-800">
            Learn More
          </Button>
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          <Button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700">
            <FaApple /> App Store
          </Button>
          <Button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700">
            <FaGooglePlay /> Play Store
          </Button>
        </div>
      </motion.header>

      {/* Features Section */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {[
          {
            title: "AI-Driven Insights",
            desc: "Get personalized financial recommendations.",
            icon: <FaRobot />,
          },
          {
            title: "Automated Expense Tracking",
            desc: "Categorize and analyze your spending effortlessly.",
            icon: <FaChartLine />,
          },
          {
            title: "Secure Transactions",
            desc: "State-of-the-art encryption for your financial data.",
            icon: <FaUserShield />,
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="p-6 bg-gray-900 shadow-lg text-center">
              <CardContent>
                <div className="text-4xl text-blue-400 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-400">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-400">{feature.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Dashboard Preview */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-4xl text-center mt-16"
      >
        <h2 className="text-3xl font-bold text-blue-300">
          Live Expense Insights
        </h2>
        <p className="mt-2 text-gray-400">
          Visualize your expenses dynamically.
        </p>
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <Image
            src=""
            width={600}
            height={350}
            alt="Dashboard Preview"
            className="rounded-lg"
          />
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="w-full max-w-5xl text-center mt-16"
      >
        <h2 className="text-3xl font-bold text-blue-300">What Our Users Say</h2>
        <p className="mt-2 text-gray-400">
          Real feedback from satisfied users.
        </p>
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <Image
            src=""
            width={600}
            height={350}
            alt="User Testimonials"
            className="rounded-lg"
          />
        </div>
      </motion.section>

      {/* Download App */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl text-center mt-16"
      >
        <h2 className="text-3xl font-bold text-blue-300">Download Our App</h2>
        <p className="mt-2 text-gray-400">
          Start tracking your transactions effortlessly.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <Button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700">
            <FaApple /> App Store
          </Button>
          <Button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700">
            <FaGooglePlay /> Play Store
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center mt-16 mb-12">
        <h2 className="text-2xl font-semibold text-blue-400">
          Sign Up For Our Newsletters
        </h2>
        <Button className="mt-4 px-6 py-3 text-lg bg-purple-600 hover:bg-purple-700">
          Subscribe Now
        </Button>
      </footer>
    </div>
  );
}
