import ExcelJS from 'exceljs';

const normalizeFilename = (filename) => {
  const trimmed = String(filename || "export.xlsx").trim();
  if (trimmed.toLowerCase().endsWith(".xlsx")) {
    return trimmed;
  }
  return trimmed.replace(/\.[^.]+$/, "") + ".xlsx";
};

export const downloadExcelWorksheet = async ({ filename, sheetName, title, subtitle, columns, rows, summary = [] }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName || "Sheet1");

  let currentRow = 1;

  // Title
  if (title) {
    const endCol = Math.max(columns.length, 1);
    worksheet.mergeCells(currentRow, 1, currentRow, endCol);
    const titleCell = worksheet.getCell(currentRow, 1);
    titleCell.value = title;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    currentRow++;
  }

  // Subtitle
  if (subtitle) {
    const endCol = Math.max(columns.length, 1);
    worksheet.mergeCells(currentRow, 1, currentRow, endCol);
    const subtitleCell = worksheet.getCell(currentRow, 1);
    subtitleCell.value = subtitle;
    subtitleCell.font = { size: 12, italic: true };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    currentRow++;
  }

  if (title || subtitle) {
    currentRow++; // Blank row
  }

  // Summary
  const validSummary = summary.filter((item) => item?.label);
  if (validSummary.length > 0) {
    validSummary.forEach((item) => {
      const labelCell = worksheet.getCell(currentRow, 1);
      const valueCell = worksheet.getCell(currentRow, 2);
      labelCell.value = item.label;
      labelCell.font = { bold: true };
      valueCell.value = item.value || "-";
      currentRow++;
    });
    currentRow++; // Blank row
  }

  // Header Row
  const headerRowIndex = currentRow;
  columns.forEach((column, index) => {
    const cell = worksheet.getCell(headerRowIndex, index + 1);
    cell.value = column.label;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White text
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0284C7' } // Sky Blue background
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  currentRow++;

  // Data Rows
  rows.forEach((item) => {
    columns.forEach((column, index) => {
      const cell = worksheet.getCell(currentRow, index + 1);
      const val = (typeof column.value === "function" ? column.value(item) : item?.[column.key]) ?? "-";
      cell.value = val;
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
      
      // Basic alignment
      if (typeof val === 'number') {
        cell.alignment = { horizontal: 'right' };
      } else {
        cell.alignment = { horizontal: 'left' };
      }
    });
    currentRow++;
  });

  // Auto Column Widths
  columns.forEach((column, index) => {
    let maxLength = String(column.label || "").length + 5;
    
    rows.forEach((item) => {
      const val = (typeof column.value === "function" ? column.value(item) : item?.[column.key]) ?? "-";
      const valStr = String(val);
      if (valStr.length > maxLength) {
        maxLength = Math.min(valStr.length + 2, 50); // Cap width at 50
      }
    });
    worksheet.getColumn(index + 1).width = Math.max(maxLength, 14);
  });

  // Download logic for Browser
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = normalizeFilename(filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
