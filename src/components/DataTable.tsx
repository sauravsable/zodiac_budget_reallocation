import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"; // adjust the path as necessary

const DataTable = ({ tablename, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const tableHeader =
    tablename === "Low Competition Market"
      ? ["Keyword", "City", "Competitors", "With Ads"]
      : ["Keyword", "City", "Org rank", "Ad rank", "Rank Diff"];

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = currentPage - 1 + rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl text-center mt-2 font-semibold">{tablename}</h2>

      <Table className="border border-border bg-white">
        <TableHeader>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableHead key={index} className="text-left">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length > 0 ? (
            currentData.map((user) => (
              <TableRow key={user.keywordid} className="hover:bg-gray-50">
                <TableCell>{user.keywordid}</TableCell>
                <TableCell>{user.cityname}</TableCell>
                {tablename === "Low Competition Market" ? (
                  <>
                    <TableCell>{user.total_count}</TableCell>
                    <TableCell>{user.competator_count}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{user.org_rank}</TableCell>
                    <TableCell>{user.ad_rank}</TableCell>
                    <TableCell>{user.rank_difference}</TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
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
  );
};

export default DataTable;
