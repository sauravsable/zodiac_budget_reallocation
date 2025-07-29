import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import BrandSelect from "@/components/BrandSelect";
import DataTable from "@/components/DataTable";

const WhitespaceAnalysis = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  return (
    <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-6">
      <h1 className="text-3xl font-bold text-foreground text-center gap-3 w-full p-4">Whitespace Analysis</h1>
      <div className="text-center">You will see the Whitespace Analysis for planning your ads accordingly.</div>
      {!selectedBrand ? (
        <div className="flex flex-col gap-10 p-4 min-h-96 items-center justify-center">
          <div className="w-1/3">
            <div className="mb-10">Select Your Brand and view Whitespace Analysis</div>
            <BrandSelect selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
          </div>
        </div>
      ) : (
        <div className="flex gap-10">
          <DataTable />
          <DataTable />
        </div>
      )}
    </div>
  );
};

export default WhitespaceAnalysis;
