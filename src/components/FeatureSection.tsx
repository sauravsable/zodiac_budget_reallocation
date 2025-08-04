import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Zap, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Opportunity Finder",
    description: "Identifies hidden growth areas across low-visibility campaigns.",
  },
  {
    title: "Auto Scaling",
    description: "Allocates more budget to top-performers — instantly and intelligently.",
  },
  {
    title: "Performance Index",
    description: "Combines spend, ROI, and growth potential into a single score.",
  },
  {
    title: "Predictive Insights",
    description: "Forecasts success and suggests optimizations with AI modeling.",
  },
];

const methodology = [
  {
    step: "1. Efficiency Scoring",
    color: "from-blue-500 to-blue-300",
    description: "Products with increased sales and reduced spend get bonus points",
  },
  {
    step: "2. Weighted Ranking",
    color: "from-green-500 to-green-300",
    description: "30% efficiency + 70% incremental performance",
  },
  {
    step: "3. Smart Allocation",
    color: "from-purple-500 to-purple-300",
    description: "Up to 3x budget for efficiency winners, 2.5x for top performers",
  },
  {
    step: "4. ROI Projection",
    color: "from-orange-500 to-orange-300",
    description: "Forecasts sales increases based on allocation multipliers",
  },
];

export default function ElegantFeaturesUI() {
  return (
    <div className="space-y-16 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto w-11/12 md:w-4/5"
      >
        <Card className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-md shadow-2xl border border-gray-200">
          <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-l-3xl" />

          <CardHeader className="p-8 pb-4">
            <CardTitle className="flex items-center gap-4 text-4xl font-extrabold text-gray-900">
              <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
              Key Features
            </CardTitle>
            <CardDescription className="mt-3 text-xl text-gray-600">
              Supercharge your campaigns with AI-driven performance tools
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-4 rounded-2xl p-6 bg-white/90 shadow-md hover:shadow-lg transition transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{feature.title}</h4>
                  <p className="text-base text-gray-600 mt-2">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="mx-auto w-11/12 md:w-4/5"
      >
        <Card className="rounded-3xl shadow-2xl border border-gray-200 bg-white/60 backdrop-blur-md">
          <CardHeader className="p-8">
            <CardTitle className="text-4xl font-extrabold text-gray-900">Analysis Methodology</CardTitle>
            <CardDescription className="mt-3 text-xl text-gray-600">How the advanced algorithm works</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {methodology.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, translateY: -3 }}
                className={`p-6 rounded-xl shadow-md hover:shadow-lg transition bg-gradient-to-br ${item.color} text-white`}
              >
                <h4 className="text-xl font-bold">{item.step}</h4>
                <p className="text-base mt-2">{item.description}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
