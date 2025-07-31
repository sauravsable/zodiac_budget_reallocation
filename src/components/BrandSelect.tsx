import React, { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { allParamsDefined, api, QueryKeys } from "@/utils/api";
import { useBrandStore, usePlatformStore } from "@/utils/zusStore";
import { FixedSizeList as List } from "react-window";
import { ChevronDown, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEM_HEIGHT = 36;
const VISIBLE_COUNT = 8;

export default function BrandSelect() {
  const platform = usePlatformStore((state) => state.platform);
  const setSelectedBrand = useBrandStore((state) => state.setSelectedBrand);
  const selectedBrand = useBrandStore((state) => state.selectedBrand);

  const { data: brands, isLoading } = useQuery({
    queryKey: [QueryKeys.lowCompetitionMarket, { platformId: platform.toLowerCase() }],
    queryFn: ({ signal }) => api.whiteSpaceAnalysis.brandList({ platformId: platform.toLowerCase() }, signal),
    select: (data) => data.data,
    enabled: allParamsDefined({ platformId: platform.toLowerCase() }),
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredBrands = useMemo(
    () => brands?.filter((brand) => brand.toLowerCase().includes(search.toLowerCase())).sort() ?? [],
    [brands, search]
  );

  const Row = ({ index, style }) => {
    const brand = filteredBrands[index];
    return (
      <div
        style={style}
        className={cn(
          "cursor-pointer px-3 py-1.5 text-sm flex items-center transition-colors duration-200",
          selectedBrand === brand ? "bg-blue-500 text-white font-medium" : "hover:bg-blue-100"
        )}
        onClick={() => {
          setSelectedBrand(brand);
          setOpen(false);
        }}
      >
        <Tag className="h-4 w-4 mr-2" />
        {brand}
      </div>
    );
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-medium text-base px-4 py-2 text-gray-800 hover:bg-blue-50 transition-all duration-200"
        >
          {selectedBrand || "Select your Brand"}
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="w-72 p-3 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
        side="bottom"
        align="start"
        avoidCollisions={false}
      >
        {isLoading ? (
          <div className="space-y-4 w-full">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2 animate-pulse" />
          </div>
        ) : (
          <>
            <Input
              placeholder="Search brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 mb-3 text-sm rounded-md"
            />
            {filteredBrands.length > 0 ? (
              <div className="rounded-md border border-gray-200 overflow-hidden max-h-[300px]">
                <List
                  height={Math.min(filteredBrands.length, VISIBLE_COUNT) * ITEM_HEIGHT}
                  itemCount={filteredBrands.length}
                  itemSize={ITEM_HEIGHT}
                  width="100%"
                >
                  {Row}
                </List>
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">No results found.</div>
            )}
          </>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}
