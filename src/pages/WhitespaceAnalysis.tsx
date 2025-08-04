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
      <h1 className="text-4xl font-extrabold text-foreground text-center gap-3 w-full p-4">Whitespace Analysis</h1>
      <div className="text-center text-xl">You will see the Whitespace Analysis for planning your ads accordingly.</div>
      {!getData ? (
        <div className="flex flex-col gap-8 p-8 min-h-96 items-center justify-center bg-white/30 backdrop-blur-md shadow-2xl rounded-3xl mt-8 w-[60%] mx-auto border border-white/20 transition-all duration-300">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-extrabold bg-gradient-to-r from-gray-800 via-black to-gray-800 bg-clip-text text-transparent">
              Select a Platform
            </h2>
            <PlatformSwitch />
          </div>

          {/* Group Wrapper to align Selects & Button */}
          <div className="flex flex-col items-center gap-6 w-full max-w-[40rem]">
            {/* Selects Row */}
            <div className="flex flex-row items-center justify-center gap-6 w-full">
              <motion.div initial="hidden" animate="visible" custom={0.2} className="flex-1 rounded-xl p-1">
                <BrandSelect />
              </motion.div>

              <motion.div initial="hidden" animate="visible" custom={0.4} className="flex-1 rounded-xl p-1">
                <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
              </motion.div>
            </div>

            {/* Button Full Width of Group */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="w-full"
            >
              <Button
                onClick={() => {
                  if (allParamsDefined(params1)) {
                    setGetData(true);
                  }
                }}
                variant="default"
                size="lg"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:brightness-110 hover:shadow-2xl active:brightness-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200"
              >
                <Settings className="mr-2" /> Show Whitespace Analysis
              </Button>
            </motion.div>
          </div>
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
