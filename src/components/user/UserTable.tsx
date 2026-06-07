import { Eye, Pencil } from "lucide-react";
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
import { UserForm } from "./UserForm";
import type { UserFormData } from "@/lib/schemas";
import type { Advisor, Client } from "@/types";
import { fullName, getAgeFromPersonalId } from "@/lib/utils";

interface UserTableProps {
  data: Array<Client | Advisor>;
  basePath: string;
  emptyMessage?: string;
  onEdit: (id: string, data: UserFormData) => Promise<void>;
  onDelete: (id: string) => void;
  editLabels: {
    dialogTitle: string;
    description: string;
  };
  deleteDialogTitle: string;
  deleteDialogDescription: string;
}

export function UserTable({
  data,
  basePath,
  emptyMessage = "Žádné záznamy",
  onEdit,
  onDelete,
  editLabels,
  deleteDialogTitle,
  deleteDialogDescription,
}: UserTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jméno</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Věk</TableHead>
          <TableHead className="text-right">Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-24 text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
        {data.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => navigate(`${basePath}/${row.id}`)}
            className="cursor-pointer"
          >
            <TableCell>{fullName(row.firstName, row.lastName)}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.phone}</TableCell>
            <TableCell>{getAgeFromPersonalId(row.personalId) ?? "—"}</TableCell>
            <TableCell
              className="text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex space-x-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`${basePath}/${row.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <UserForm
                  labels={{
                    trigger: <Pencil className="h-4 w-4" />,
                    ...editLabels,
                  }}
                  defaultValues={row}
                  triggerVariant="ghost"
                  triggerSize="icon"
                  onSubmit={(data) => onEdit(row.id, data)}
                />

                <DeleteDialog
                  title={deleteDialogTitle}
                  description={deleteDialogDescription}
                  onConfirm={() => onDelete(row.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
