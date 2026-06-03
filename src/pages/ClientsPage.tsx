import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClients } from "@/hooks/useClients";
import * as clientService from "@/services/clients";
import { getAgeFromPersonalId } from "@/lib/utils";
import type { ClientFormData } from "@/lib/schemas";

export default function ClientsPage() {
  const { data: clients } = useClients();
  const navigate = useNavigate();

  const handleCreate = async (data: ClientFormData) => {
    await clientService.create({
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
  };

  const handleUpdate = async (id: string, data: ClientFormData) => {
    await clientService.update(id, {
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Klienti</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Správa klientů a jejich smluv
          </p>
        </div>
        <ClientForm onSubmit={handleCreate} />
      </div>

      <Table>
        <TableCaption>Klienti</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>Příjmení</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Rodné číslo</TableHead>
            <TableHead>Věk</TableHead>
            <TableHead>Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.firstName}</TableCell>
              <TableCell>{client.lastName}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.personalId}</TableCell>
              <TableCell>{client.age}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* detail */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <Eye />
                  </Button>

                  {/* update */}
                  <ClientForm
                    onSubmit={(data) => handleUpdate(client.id, data)}
                    defaultValues={{ ...client }}
                    triggerLabel={<Pencil />}
                    triggerVariant="ghost"
                    triggerSize="icon"
                  />

                  {/* delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className="text-destructive">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Opravdu chcete smazat tohoto klienta?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tato akce nemůže být vrácena. Tímto bude klient trvale
                          odstraněn, včetně všech jeho dat.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => {
                            clientService.deleteById(client.id);
                          }}
                        >
                          Smazat
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
