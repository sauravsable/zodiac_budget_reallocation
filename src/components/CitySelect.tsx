import React, { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCityStore } from "@/utils/zusStore";
import { FixedSizeList as List } from "react-window";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils"; // optional: classNames utility

const ITEM_HEIGHT = 36;
const VISIBLE_COUNT = 8;

const CitySelect = ({ city = [] }) => {
  const selectedCity = useCityStore((state) => state.selectedCity);
  const setSelectedCity = useCityStore((state) => state.setSelectedCity);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const uniqueCities = useMemo(() => ["All Cities", ...Array.from(new Set(city.map((item) => item))).sort()], [city]);

  const filteredCities = useMemo(
    () => uniqueCities.filter((city) => city.toLowerCase().includes(search.toLowerCase())),
    [uniqueCities, search]
  );

  const Row = ({ index, style }) => {
    const cityName = filteredCities[index];
    return (
      <div
        style={style}
        className={cn(
          "cursor-pointer px-3 py-1.5 text-sm hover:bg-blue-100 flex items-center transition-colors duration-200",
          selectedCity === cityName && "bg-blue-500 text-white font-medium"
        )}
        onClick={() => {
          setSelectedCity(cityName);
          setOpen(false);
        }}
      >
        <MapPin className="h-4 w-4 mr-2" />
        {cityName}
      </div>
    );
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-medium text-base px-4 py-2 hover:bg-blue-50 transition-all duration-200"
        >
          {selectedCity || "Select your City"}
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="w-72 p-3 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
        side="bottom"
        align="start"
      >
        {uniqueCities.length === 0 ? (
          <div className="space-y-4 w-full">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2 animate-pulse" />
          </div>
        ) : (
          <>
            <Input
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 mb-3 text-sm rounded-md"
            />
            {filteredCities.length > 0 ? (
              <div className="rounded-md border border-gray-200 overflow-hidden max-h-[300px]">
                <List
                  height={Math.min(filteredCities.length, VISIBLE_COUNT) * ITEM_HEIGHT}
                  itemCount={filteredCities.length}
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
};

export default CitySelect;
