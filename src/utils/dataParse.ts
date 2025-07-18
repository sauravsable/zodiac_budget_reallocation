import * as XLSX from "xlsx";
import { BudgetDataZepto } from "@/pages/BudgetAllocation";

export const parseCSV = (
  csvText: string,
  requiredColumns: string[]
): BudgetDataZepto[] => {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) {
    throw new Error(
      "CSV file must contain at least a header row and one data row"
    );
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  // Check for required columns
  const missingColumns = requiredColumns.filter(
    (col) => !headers.includes(col)
  );
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  const data: BudgetDataZepto[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));

    if (values.length !== headers.length) {
      console.warn(
        `Row ${i + 1} has ${values.length} values but expected ${
          headers.length
        }, skipping...`
      );
      continue;
    }

    const row: any = {};
    headers.forEach((header, index) => {
      const value = values[index];

      // Convert numeric columns
      if (
        header.includes("Sales") ||
        header.includes("Spend") ||
        header.includes("ROI")
      ) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new Error(
            `Invalid numeric value "${value}" in column "${header}" at row ${
              i + 1
            }`
          );
        }
        row[header] = numValue;
      } else {
        row[header] = value;
      }
    });

    data.push(row as BudgetDataZepto);
  }

  if (data.length === 0) {
    throw new Error("No valid data rows found in CSV file");
  }

  return data;
};

export const parseXLSX = async (
  file: File,
  requiredColumns: string[]
): Promise<BudgetDataZepto[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
    defval: "",
  });

  if (jsonData.length === 0) {
    throw new Error("XLSX file is empty or sheet has no data");
  }

  const headers = Object.keys(jsonData[0]).map((h) => h.trim());

  const missingColumns = requiredColumns.filter(
    (col) => !headers.includes(col)
  );
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  const data: BudgetDataZepto[] = jsonData.map((row, rowIndex) => {
    const cleanedRow: any = {};
    headers.forEach((header) => {
      const value = row[header];
      if (
        header.includes("Sales") ||
        header.includes("Spend") ||
        header.includes("ROI")
      ) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new Error(
            `Invalid numeric value "${value}" in column "${header}" at row ${
              rowIndex + 2
            }`
          );
        }
        cleanedRow[header] = numValue;
      } else {
        cleanedRow[header] = value;
      }
    });
    return cleanedRow as BudgetDataZepto;
  });

  if (data.length === 0) {
    throw new Error("No valid data rows found in XLSX file");
  }

  return data;
};
