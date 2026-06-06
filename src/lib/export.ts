import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportRow = Record<string, string | number>;

export function formatExportDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("cs-CZ");
}

export function exportToCSV(rows: ExportRow[], filename: string): void {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) =>
    headers
      .map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [headers.join(","), ...body].join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}

export function exportToExcel(rows: ExportRow[], filename: string): void {
  if (!rows.length) return;

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Export");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportToPDF(
  rows: ExportRow[],
  filename: string,
  title?: string,
): void {
  if (!rows.length) return;

  const doc = new jsPDF();

  if (title) {
    doc.setFontSize(14);
    doc.text(title, 14, 15);
  }

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((h) => String(row[h] ?? "")));

  autoTable(doc, {
    head: [headers],
    body,
    startY: title ? 22 : 14,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 30, 30] },
  });

  doc.save(`${filename}.pdf`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
