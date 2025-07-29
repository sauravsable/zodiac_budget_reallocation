import React, { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // make sure you have this component

const BrandSelect = ({ selectedBrand, setSelectedBrand }) => {
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"];
  const [search, setSearch] = useState("");

  const filteredBrands = brands.filter((brand) => brand.toLowerCase().includes(search.toLowerCase()));

  return (
    <Select onValueChange={(value) => setSelectedBrand(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Select your Brand" />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8" />
        </div>
        {filteredBrands.length ? (
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
