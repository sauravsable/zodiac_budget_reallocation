import React, { useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"; // adjust the path as necessary
import { usePlatformStore } from "@/utils/zusStore";

const DataTable = ({ tablename, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchkeyword, setsearchkeyword] = useState('')
  const [filterData, setfilterData] = useState(null)
  const platform = usePlatformStore((state) => state.platform);

  const rowsPerPage = 10;
  const tableHeader =
    tablename === "Low Competition Market"
      ? ["Keyword", "City", "Competitors", "With Ads"]
      : ["Keyword", "City", "Org rank", "Ad rank", "Rank Diff"];

  const startIndex = (currentPage - 1) + rowsPerPage;
  const currentData = useMemo(() => {
    if (!data) return [];

    const filtered = searchkeyword.trim()
      ? data.filter((item) =>
        item.keywordid?.toLowerCase().includes(searchkeyword.toLowerCase())
      )
      : data;
    setfilterData(filtered);

    return filtered.slice(startIndex, startIndex + rowsPerPage);
  }, [data, searchkeyword, startIndex, rowsPerPage]);

  const totalPages = useMemo(() => { return Math.ceil(filterData?.length / rowsPerPage) }, [filterData, rowsPerPage]);


  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="fle flex-col mb-10 bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-row justify-end gap-5 items-align ">
        <div className=" px-4 py-1 text-lg font-semibold text-center bg-blue-200 text-blue-500 rounded-lg ">
          {platform}
        </div>
        <div>
          <input
            type="text"
            placeholder="search keyword..."
            className="border px-2 py-1  rounded w-full"
            onChange={(e) => setsearchkeyword(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 w-full">
        <h2 className="text-xl  text-center mt-2 font-semibold">{tablename}</h2>

        <Table className="border border-border bg-white shadow-sm rounded-lg overflow-hidden w-full table-fixed">
          <TableHeader className="bg-gray-100">
            <TableRow>
              {tableHeader.map((header, index) => (
                <TableHead
                  key={index}
                  className={`text-left px-4 py-3 font-semibold text-gray-700 ${index === 0
                    ? 'w-[20%]'
                    : index === 1
                      ? 'w-[20%]'
                      : tablename === 'Low Competition Market'
                        ? index === 2
                          ? 'w-[30%]'
                          : 'w-[30%]'
                        : index === 2
                          ? 'w-[20%]'
                          : index === 3
                            ? 'w-[20%]'
                            : 'w-[20%]'
                    }`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((user, index) => (
                <TableRow key={`${user.keywordid}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="px-4 py-3 w-[20%] truncate">{user.keywordid}</TableCell>
                  <TableCell className="px-4 py-3 w-[20%] truncate">{user.cityname}</TableCell>

                  {tablename === "Low Competition Market" ? (
                    <>
                      <TableCell className="px-4 py-3 w-[30%] truncate">{user.total_count}</TableCell>
                      <TableCell className="px-4 py-3 w-[30%] truncate">{user.competator_count}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="px-4 py-3 w-[20%] truncate">{user.org_rank}</TableCell>
                      <TableCell className="px-4 py-3 w-[20%] truncate">{user.ad_rank}</TableCell>
                      <TableCell className="px-4 py-3 w-[20%] truncate">{user.rank_difference}</TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tablename === "Low Competition Market" ? 4 : 5}
                  className="text-center py-6 text-gray-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>


        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
