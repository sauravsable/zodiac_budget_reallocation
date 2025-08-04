import React, { useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useCityStore, usePlatformStore, useBrandStore } from "@/utils/zusStore";
import { Button } from "@/components/ui/button"; // Adjust the path as needed
import { CircleArrowDown, ChevronLeft, ChevronRight, MoveUp, MoveDown, MoveVertical } from "lucide-react";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils"; // Optional utility to join classNames conditionally
import CitySelect from "./CitySelect";

const DataTable = ({ tablename, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchkeyword, setsearchkeyword] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const platform = usePlatformStore((state) => state.platform);
  const selectedCity = useCityStore((state) => state.selectedCity);
  const selectedBrand = useBrandStore((state) => state.selectedBrand);

  const rowsPerPage = 10;

  const tableHeader =
    tablename === "Low Competition Market"
      ? ["Keyword", "City", "Impressions", "Competitors", "With Ads", "Score"]
      : ["Keyword", "City", "Org rank", "Ad rank", "Rank Diff"];

  const headerKeys =
    tablename === "Low Competition Market"
      ? ["keywordid", "cityname", "impressions", "competitor", "with_ads", "score"]
      : ["keywordid", "cityname", "org_rank", "ad_rank", "rank_difference"];

  const startIndex = (currentPage - 1) * rowsPerPage;

  const sortedData = useMemo(() => {
    let filtered =
      searchkeyword.trim() || selectedCity
        ? data.filter((item) =>
            selectedCity == "All Cities"
              ? item.keywordid?.toLowerCase().includes(searchkeyword.toLowerCase())
              : item.keywordid?.toLowerCase().includes(searchkeyword.toLowerCase()) && item.cityname === selectedCity
          )
        : data;

    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        } else {
          return sortOrder === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        }
      });
    }

    return filtered;
  }, [data, searchkeyword, sortKey, sortOrder, selectedCity]);

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${tablename.replace(/\s+/g, "_")}_Export.xlsx`);
  };

  const currentData = useMemo(() => {
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, startIndex, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-6 max-w-full overflow-hidden transition-all duration-300">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

        <div className="flex gap-4">

        <div className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-indigo-200 via-blue-200 to-cyan-200 text-blue-800 shadow-inner tracking-wide">
          🌐 Platform: <span className="font-semibold">{platform}</span>
        </div>

        <div className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-yellow-200 via-green-200 to-green-200 text-yellow-800 shadow-inner tracking-wide">
          🌐 Brand: <span className="font-semibold">{selectedBrand}</span>
        </div>


        </div>
        

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Search by keyword..."
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            onChange={(e) => {
              setsearchkeyword(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div>
            <CitySelect city={data.map((item) => item.cityname)} />
          </div>
          <Button
            onClick={handleExportToExcel}
            className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-300 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1"
          >
            <CircleArrowDown className="animate-bounce-slow" /> Export
          </Button>
        </div>
      </div>

      {/* Table Title */}
      <h2 className="text-2xl font-bold text-center text-gray-800 drop-shadow-sm tracking-wide">✨ {tablename}</h2>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-100 transition-all duration-300">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-inner">
            <TableRow>
              {tableHeader.map((header, index) => {
                const key = headerKeys[index];
                return (
                  <TableHead
                    key={key}
                    onClick={() => handleSort(key)}
                    className={cn(
                      "px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none whitespace-nowrap hover:text-indigo-600 transition",
                      index === 0
                        ? "w-[20%]"
                        : index === 1
                        ? "w-[20%]"
                        : tablename === "Low Competition Market"
                        ? "w-[30%]"
                        : "w-[20%]"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      <span className="text-xs transition-all duration-200">
                        {sortKey === key ? (
                          sortOrder === "asc" ? (
                            <MoveUp size={16} />
                          ) : (
                            <MoveDown size={16} />
                          )
                        ) : (
                          <MoveVertical size={16} />
                        )}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((user, index) => (
                <TableRow
                  key={`${user.keywordid}-${index}`}
                  className={cn("transition-colors rounded-xl", index % 2 === 1 ? "" : "", "hover:bg-indigo-100/60")}
                  style={{
                    backgroundColor: index % 2 === 1 ? "#f7fbff" : "transparent", // Very light blue
                  }}
                >
                  <TableCell className="px-4 py-3 truncate text-gray-800 font-medium">{user.keywordid}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-gray-600">{user.cityname}</TableCell>
                  

                  {tablename === "Low Competition Market" ? (
                    <>
                      <TableCell className="px-4 py-3 truncate text-gray-600">{user.impressions}</TableCell>
                      <TableCell className="px-4 py-3 text-indigo-700">{user.competitor}</TableCell>
                      <TableCell className="px-4 py-3 text-pink-700">{user.with_ads}</TableCell>
                       <TableCell className="px-4 py-3 text-pink-700">{user.score}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="px-4 py-3 text-blue-700">{user.org_rank}</TableCell>
                      <TableCell className="px-4 py-3 text-green-700">{user.ad_rank}</TableCell>
                      <TableCell className="px-4 py-3 text-red-700">{user.rank_difference}</TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tablename === "Low Competition Market" ? 4 : 5}
                  className="text-center py-6 text-gray-400 italic"
                >
                  😕 No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-indigo-100 transition disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Previous
        </Button>

        <div className="text-sm text-gray-600">
          Page <span className="font-semibold text-indigo-600">{currentPage}</span> of{" "}
          <span className="font-semibold text-indigo-600">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-indigo-100 transition disabled:opacity-40"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
