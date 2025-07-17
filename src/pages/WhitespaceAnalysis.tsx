import React from "react";
import { Hourglass } from "lucide-react"; // optional icon

const WhitespaceAnalysis = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-6">
      <div className="text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <Hourglass size={48} className="text-blue-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Whitespace Analysis
        </h1>
        <p className="text-lg text-gray-600 mb-4">This feature is coming soon.</p>
        <p className="text-sm text-gray-500">
          We're working hard to bring this to you. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default WhitespaceAnalysis;
