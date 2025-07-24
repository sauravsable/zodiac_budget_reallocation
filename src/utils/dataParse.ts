import * as XLSX from "xlsx";

export function parseCSV(
  csvFiles: { filename: string; content: string }[],
  requiredColumns: string[],
  allowedSheets: string[],
  numericColumns: string[]
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
      const rowObj: Record<string, any> = {};

      headers.forEach((header, i) => {
        const value = values[i] || "";
        rowObj[header] = numericColumns.includes(header)
          ? Number(value) || 0
          : value;
      });

      if (requiredColumns.every((col) => col in rowObj)) {
        combinedData.push(rowObj);
      }
    }
  }

  return combinedData;
}

export function parseXLSX(
  file: File,
  requiredColumns: string[],
  allowedSheets: string[],
  numericColumns: string[]
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetNames = workbook.SheetNames;
      const selectedSheets = sheetNames.length === 1
        ? sheetNames
        : sheetNames.filter((name) => allowedSheets.includes(name));

      if (selectedSheets.length === 0) {
        return reject(new Error("No allowed sheets found in the uploaded XLSX file"));
      }

      const combinedData: any[] = [];

      for (const sheetName of selectedSheets) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const filteredData = jsonData
          .filter((row: any) => requiredColumns.every((col) => col in row))
          .map((row: any) => {
            const newRow: Record<string, any> = { ...row };
            for (const col of numericColumns) {
              if (col in newRow) {
                newRow[col] = Number(newRow[col]) || 0;
              }
            }
            return newRow;
          });

        combinedData.push(...filteredData);
      }

      resolve(combinedData);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
