const normalizeFilename = (filename) => {
  const trimmed = String(filename || "export.xlsx").trim();
  if (trimmed.toLowerCase().endsWith(".xlsx")) {
    return trimmed;
  }
  return trimmed.replace(/\.[^.]+$/, "") + ".xlsx";
};

const buildSheetRows = ({ title, subtitle, columns, rows, summary }) => {
  const sheetRows = [];
  const headerLabels = columns.map((column) => column.label);

  if (title) {
    sheetRows.push([title]);
  }
  if (subtitle) {
    sheetRows.push([subtitle]);
  }
  if (title || subtitle) {
    sheetRows.push([]);
  }

  summary
    .filter((item) => item?.label)
    .forEach((item) => {
      sheetRows.push([item.label, item.value || "-"]);
    });

  if (summary.length > 0) {
    sheetRows.push([]);
  }

  sheetRows.push(headerLabels);

  rows.forEach((item) => {
    sheetRows.push(
      columns.map((column) => (typeof column.value === "function" ? column.value(item) : item?.[column.key]) ?? "-"),
    );
  });

  return sheetRows;
};

export const downloadExcelWorksheet = async ({ filename, sheetName, title, subtitle, columns, rows, summary = [] }) => {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  const sheetRows = buildSheetRows({ title, subtitle, columns, rows, summary });
  const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);
  const headerRowIndex = (title ? 1 : 0) + (subtitle ? 1 : 0) + (title || subtitle ? 1 : 0) + summary.filter((item) => item?.label).length + (summary.length > 0 ? 1 : 0);

  worksheet["!cols"] = columns.map((column) => ({
    wch: Math.max(14, String(column.label || "").length + 4),
  }));

  if (columns.length > 0 && headerRowIndex >= 0) {
    const mergeEndColumn = Math.max(columns.length - 1, 0);
    worksheet["!merges"] = [];
    if (title) {
      worksheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: mergeEndColumn } });
    }
    if (subtitle) {
      const subtitleRow = title ? 1 : 0;
      worksheet["!merges"].push({ s: { r: subtitleRow, c: 0 }, e: { r: subtitleRow, c: mergeEndColumn } });
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Sheet1");
  XLSX.writeFile(workbook, normalizeFilename(filename), { bookType: "xlsx" });
};
