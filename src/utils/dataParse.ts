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

interface CSVFile {
  filename: string;
  content: string;
}

export function parseMultipleCSVSheetsSelected(
  csvFiles: { filename: string; content: string }[],
  requiredColumns: string[],
  allowedSheets: string[]
): any[] {
  const isSingle = csvFiles.length === 1;

  const selectedCSVs = isSingle
    ? csvFiles
    : csvFiles.filter((f) =>
        allowedSheets.some((sheet) => f.filename.includes(sheet))
      );

  if (!isSingle && selectedCSVs.length === 0) {
    throw new Error("No allowed CSV files found");
  }

  const combinedData: any[] = [];

  for (const { content } of selectedCSVs) {
    const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1);

    for (const row of rows) {
      const values = row.split(",");
      const rowObj: Record<string, string> = {};

      headers.forEach((header, i) => {
        rowObj[header] = values[i] || "";
      });

      if (requiredColumns.every((col) => col in rowObj)) {
        combinedData.push(rowObj);
      }
    }
  }

  return combinedData;
}


export function parseXLSXSelectedSheets(
  file: File,
  requiredColumns: string[],
  allowedSheets: string[]
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetNames = workbook.SheetNames;
      let selectedSheets: string[];

      if (sheetNames.length === 1) {
        selectedSheets = sheetNames;
      } else {
        selectedSheets = sheetNames.filter((name) =>
          allowedSheets.includes(name)
        );
      }

      if (selectedSheets.length === 0) {
        return reject(
          new Error("No allowed sheets found in the uploaded XLSX file")
        );
      }

      const combinedData: any[] = [];

      for (const sheetName of selectedSheets) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const filteredData = jsonData.filter((row: any) =>
          requiredColumns.every((col) => col in row)
        );

        combinedData.push(...filteredData);
      }

      resolve(combinedData);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}