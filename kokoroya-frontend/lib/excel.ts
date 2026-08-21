import * as XLSX from "xlsx";

export function downloadExcel(
  filename: string,
  sheets: { name: string; rows: Record<string, unknown>[] }[],
) {
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(sheet.rows),
      sheet.name,
    );
  }
  XLSX.writeFile(wb, filename);
}
