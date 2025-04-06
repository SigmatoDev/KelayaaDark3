"use client";

import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExcelUploader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData[0]?.image) {
      alert('The uploaded Excel file does not contain an "image" column.');
      return;
    }

    // Modify each comma-separated filename in the "image" column
    const updatedData = jsonData.map((row) => {
      const originalImageField = row.image;

      // If image field is missing or empty, skip modification
      if (!originalImageField || typeof originalImageField !== "string") {
        return row;
      }

      const updatedImageField = originalImageField
        .split(",")
        .map((name) => `${name.trim()}_1`)
        .join(",");

      return {
        ...row,
        image: updatedImageField,
      };
    });

    const updatedWorksheet = XLSX.utils.json_to_sheet(updatedData);
    const updatedWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(updatedWorkbook, updatedWorksheet, "Updated");

    const excelBuffer = XLSX.write(updatedWorkbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "updated_excel.xlsx");
  };

  return (
    <div className="p-6 border border-gray-300 rounded">
      <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={inputRef}
        onChange={handleFileUpload}
        className="block mb-4"
      />
    </div>
  );
};

export default ExcelUploader;
