import React, { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // make sure you have this component
import { useQuery } from "@tanstack/react-query";
import { allParamsDefined, api, QueryKeys } from "@/utils/api";
import { usePlatformStore } from "@/utils/zusStore";

const BrandSelect = ({ selectedBrand, setSelectedBrand }) => {
  const { data: brands, isLoading: brandLoading, } = useQuery({
    queryKey: [QueryKeys.lowCompetitionMarket, { platformId: usePlatformStore.getState().platform }],
    queryFn: ({ signal }) => api.whiteSpaceAnalysis.brandList({ platformId: usePlatformStore.getState().platform.toLowerCase() }, signal),
    select: (data) => data.data,
    enabled: allParamsDefined({ platformId: usePlatformStore.getState().platform.toLowerCase() }),
  });

  const [search, setSearch] = useState("");

  const filteredBrands = brands?.filter((brand) => brand.toLowerCase().includes(search.toLowerCase())).sort();
  if (brandLoading) {
    return <div className="">
      <div className="space-y-4 w-full">
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2 animate-pulse" />
       
      </div>
    </div>;
  }

  return (
    <Select onValueChange={(value) => setSelectedBrand(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Select your Brand" />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8" />
        </div>
        {filteredBrands?.length ? (
          filteredBrands.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-muted-foreground">No results found</div>
        )}
      </SelectContent>
    </Select>
  );
};

export default BrandSelect;
