import React, { useState } from "react";
import BrandSelect from "@/components/BrandSelect";
import DataTable from "@/components/DataTable";
import PlatformSwitch from "@/components/PlatformSwitch";
import { useQuery } from "@tanstack/react-query";
import { allParamsDefined, api, QueryKeys } from "@/utils/api";
import { useBrandStore, usePlatformStore } from "@/utils/zusStore";
import "react-day-picker/dist/style.css";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const WhitespaceAnalysis = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [getData, setGetData] = useState(false);
  const selectedBrand = useBrandStore((state) => state.selectedBrand);
  const platform = usePlatformStore((state) => state.platform);

  const params1 = {
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    brandName: selectedBrand,
    platformId: platform.toLowerCase(),
  };
  const { data: adEffectiveness, isLoading } = useQuery({
    queryKey: [QueryKeys.adEffectiveness, params1],
    queryFn: ({ signal }) => api.whiteSpaceAnalysis.adEffectiveness(params1, signal),
    select: (data) => data.data.filter((item) => item.org_rank !== 0 && item.ad_rank !== 0),
    enabled: allParamsDefined(params1) && getData,
  });
  const { data: lowCompetition, isLoading: isloading2 } = useQuery({
    queryKey: [QueryKeys.lowCompetitionMarket, params1],
    queryFn: ({ signal }) => api.whiteSpaceAnalysis.lowCompetitionMarket(params1, signal),
    select: (data) => data.data,
    enabled: allParamsDefined(params1) && getData,
  });

  console.log("adEffectiveness", adEffectiveness, "lowCompetition", lowCompetition);
  console.log(selectedBrand, "selectedBrand");

  if (isLoading || isloading2) {
    return (
      <div className="flex flex-col w-[98%] mx-auto gap-10 bg-white shadow-md rounded-lg p-2 mt-5">
        {/* Left table skeleton */}
        <div className="space-y-4 w-full">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2 animate-pulse" />
          <div className="border border-border bg-white">
            {/* Table header skeleton */}
            <div className="flex border-b p-2 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5" />
            </div>

            {/* Table row skeletons */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex p-2 border-b animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5" />
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center mt-2 px-4">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Right table skeleton (same as left) */}
        <div className="space-y-4 w-full">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2 animate-pulse" />
          <div className="border border-border bg-white">
            <div className="flex border-b p-2 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5 mr-4" />
              <div className="h-5 bg-gray-200 rounded w-1/5" />
            </div>

            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex p-2 border-b animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5 mr-4" />
                <div className="h-4 bg-gray-100 rounded w-1/5" />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-2 px-4">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-6 max-h-screen">
      <h1 className="text-3xl font-bold text-foreground text-center gap-3 w-full p-4">Whitespace Analysis</h1>
      <div className="text-center">You will see the Whitespace Analysis for planning your ads accordingly.</div>
      {!getData ? (
        <div className="flex flex-col gap-10 p-4 min-h-96 items-center justify-center bg-white shadow-md rounded-lg mt-10 w-[60%] mx-auto">
          <div className="">
            <div className="mb-5 text-center font-bold text-gray-800">Select a platform</div>
            <PlatformSwitch />
          </div>
          <div className="flex flex-row items-center justify-center gap-2 w-full">
            {/* Brand Selection */}

            <div className="w-[17rem]">
              <BrandSelect />
            </div>

            {/* Date Picker */}
            <div className="relative w-[17rem]">
              <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Button
              onClick={() => {
                if (allParamsDefined(params1)) {
                  setGetData(true);
                }
              }}
              variant="default"
              size="lg"
              className="w-[20rem] rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold shadow-xl hover:brightness-110 active:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            >
              <Settings /> Show Whitespace Analysis
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col gap-10 my-10 pb-10">
          <DataTable tablename="Low Competition Market" data={lowCompetition} />
          <DataTable tablename="Ad Effectiveness" data={adEffectiveness} />
        </div>
      )}
    </div>
  );
};

export default React.memo(WhitespaceAnalysis);
