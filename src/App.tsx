import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import BudgetAllocation from "./pages/BudgetAllocation";
import NotFound from "./pages/NotFound";
import WhitespaceAnalysis from "./pages/WhitespaceAnalysis";
import Sidebar from "@/components/Sidebar";
import Automation from "./pages/Automation";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-row">
            <Sidebar />
            <div className="w-[calc(100vw-16rem)] overflow-y-scroll bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
              <Routes>
                <Route path="/" element={<BudgetAllocation />} />
                <Route path="/whitespace-analysis" element={<WhitespaceAnalysis />} />
                <Route path="/automation" element={<Automation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
