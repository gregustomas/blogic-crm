import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DeleteDialog } from "../ui/delete-dialog";
import type { Contract, Client, Advisor } from "@/types";
import { fullName, cn, todayISO } from "@/lib/utils";

interface ContractsTableProps {
  data: Contract[];
  clients: Client[];
  advisors: Advisor[];
  emptyMessage?: string;
  onDelete: (id: string) => void;
  editAction: (contract: Contract) => React.ReactNode;
}

export function ContractsTable({
  data,
  clients,
  advisors,
  emptyMessage = "Žádné smlouvy",
  onDelete,
  editAction,
}: ContractsTableProps) {
  const navigate = useNavigate();

  const clientName = (id: string) => {
    const c = clients.find((c) => c.id === id);
    return c ? fullName(c.firstName, c.lastName) : "—";
  };

  const advisorName = (id: string) => {
    const a = advisors.find((a) => a.id === id);
    return a ? fullName(a.firstName, a.lastName) : "—";
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Neurčito";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("cs-CZ");
  };

  return (
    <div className="w-full overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Číslo smlouvy</TableHead>
          <TableHead>Instituce</TableHead>
          <TableHead>Klient</TableHead>
          <TableHead>Správce</TableHead>
          <TableHead>Platnost od</TableHead>
          <TableHead>Platnost do</TableHead>
          <TableHead>Poradci</TableHead>
          <TableHead className="text-right">Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={8}
              className="h-24 text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
        {data.map((contract) => (
          <TableRow
            key={contract.id}
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className="cursor-pointer"
          >
            <TableCell>{contract.registrationNumber}</TableCell>
            <TableCell>{contract.institution}</TableCell>
            <TableCell>{clientName(contract.clientId)}</TableCell>
            <TableCell>{advisorName(contract.managerId)}</TableCell>
            <TableCell>{formatDate(contract.validFrom)}</TableCell>
            <TableCell
              className={cn(
                contract.validUntil && contract.validUntil < todayISO()
                  ? "text-destructive"
                  : "",
              )}
            >
              {formatDate(contract.validUntil)}
            </TableCell>
            <TableCell>{contract.participantIds.length}</TableCell>
            {/* akce */}
            <TableCell
              className="text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex space-x-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/contracts/${contract.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                {editAction(contract)}

                <DeleteDialog
                  title="Smazat smlouvu?"
                  description="Tato akce nemůže být vrácena. Smlouva bude trvale odstraněna."
                  onConfirm={() => onDelete(contract.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
