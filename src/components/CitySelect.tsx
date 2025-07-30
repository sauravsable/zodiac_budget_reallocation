//create select dropdown for city selection by using @/components/ui/
import React, { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { allParamsDefined, api, QueryKeys } from "@/utils/api";
import { useCityStore } from "@/utils/zusStore";
import { FixedSizeList as List } from "react-window";

const ITEM_HEIGHT = 36;
const VISIBLE_COUNT = 8;
const CitySelect = ({ city = [] }) => {
    const selectedCity = useCityStore((state) => state.selectedCity);
    const setSelectedCity = useCityStore((state) => state.setSelectedCity);
    const uniquestCities = useMemo(() => {
        return Array.from(new Set(city?.map(item => item))).sort();
    }, [city]);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredBrands = useMemo(
        () =>
            uniquestCities
                ?.filter((brand) =>
                    brand.toLowerCase().includes(search.toLowerCase())
                )
                .sort() ?? [],
        [uniquestCities, search]
    );

    const Row = ({ index, style }) => {
        const brand = filteredBrands[index];
        return (
            <div
                style={style}
                className="cursor-pointer px-2 hover:bg-accent hover:text-accent-foreground flex items-center"
                onClick={() => {
                    setSelectedCity(brand);
                    setOpen(false);
                }}
            >
                {brand}
            </div>
        );
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen} >
            <Popover.Trigger asChild>
                <Button variant="outline" className="w-full font-normal justify-between">
                    {selectedCity || "Select your City"}
                </Button>
            </Popover.Trigger>
            <Popover.Content className="w-64 p-2 bg-white border rounded shadow-lg z-50">
                {uniquestCities.length === 0 ? (
                    <div className="space-y-4 w-full">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2 animate-pulse" />
                    </div>
                ) : (
                    <>
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8 mb-2"
                        />
                        {filteredBrands.length > 0 ? (
                            <List
                                height={Math.min(filteredBrands.length, VISIBLE_COUNT) * ITEM_HEIGHT}
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
                    </>
                )}
            </Popover.Content>
        </Popover.Root>
    )
}

export default CitySelect