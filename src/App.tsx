
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

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Apply dark theme to the document
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-row">
            <Sidebar />
            <div className="w-[calc(100vw-16rem)]  overflow-y-scroll">
              <Routes>
                <Route path="/" element={<BudgetAllocation />} />
                <Route path="/whitespace-analysis" element={<WhitespaceAnalysis />} />
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
