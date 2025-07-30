import React, { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { allParamsDefined, api, QueryKeys } from "@/utils/api";
import { usePlatformStore } from "@/utils/zusStore";
import { FixedSizeList as List } from "react-window";

const ITEM_HEIGHT = 36; // px
const VISIBLE_COUNT = 8;

const BrandSelect = ({ selectedBrand, setSelectedBrand }) => {
  const platform = usePlatformStore((state) => state.platform);

  const { data: brands, isLoading: brandLoading } = useQuery({
    queryKey: [QueryKeys.lowCompetitionMarket, { platformId: platform.toLowerCase() }],
    queryFn: ({ signal }) =>
      api.whiteSpaceAnalysis.brandList({ platformId: platform.toLowerCase() }, signal),
    select: (data) => data.data,
    enabled: allParamsDefined({
      platformId: platform.toLowerCase(),
    }),
  });

  const [search, setSearch] = useState("");

  const filteredBrands = useMemo(
    () =>
      brands
        ?.filter((brand) => brand.toLowerCase().includes(search.toLowerCase()))
        .sort() ?? [],
    [brands, search]
  );

  const Row = ({ index, style }) => {
    const brand = filteredBrands[index];
    return (
      <div style={style}>
        <SelectItem key={brand} value={brand}>
          {brand}
        </SelectItem>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Select onValueChange={(value) => setSelectedBrand(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select your Brand" />
        </SelectTrigger>
        {brandLoading ? (
          // Skeleton Loader
          <div className="space-y-4 w-full">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2 animate-pulse" />
          </div>
        ) : (
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
              />
            </div>
            {filteredBrands.length > 0 ? (
              <List
                height={
                  Math.min(filteredBrands.length, VISIBLE_COUNT) * ITEM_HEIGHT
                }
                itemCount={filteredBrands.length}
                itemSize={ITEM_HEIGHT}
                width="100%"
              >
                {Row}
              </List>
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </SelectContent>
        )}
      </Select>
    </div>
  );
};

export default BrandSelect;
