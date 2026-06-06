import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  type ExportRow,
} from "@/lib/export";

export function ExportButton({
  rows,
  filename,
  pdfTitle,
}: {
  rows: ExportRow[];
  filename: string;
  pdfTitle?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={!rows.length}>
          <Download className="h-4 w-4 mr-2" />
          Exportovat
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportToCSV(rows, filename)}>
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel(rows, filename)}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-muted-foreground" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToPDF(rows, filename, pdfTitle)}>
          <File className="h-4 w-4 mr-2 text-muted-foreground" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
