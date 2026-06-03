import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

async function checkDuplicates(
  email: string,
  personalId: string,
  excludeId?: string,
): Promise<boolean> {
  const [emailTaken, personalIdTaken] = await Promise.all([
    clientService.isEmailTaken(email, excludeId),
    clientService.isPersonalIdTaken(personalId, excludeId),
  ]);

  if (emailTaken) {
    toast.error("Tento email již existuje");
    return true;
  }
  if (personalIdTaken) {
    toast.error("Toto rodné číslo již existuje");
    return true;
  }
  return false;
}

export default function ClientsPage() {
  const { data: clients } = useClients();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleCreate = async (data: ClientFormData) => {
    if (await checkDuplicates(data.email, data.personalId)) return;
    await clientService.create({
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
  };

  const handleUpdate = async (id: string, data: ClientFormData) => {
    if (await checkDuplicates(data.email, data.personalId, id)) return;
    await clientService.update(id, {
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
  };

  const filteredClients =
    search.length >= 3
      ? clients?.filter((client) => {
          const q = search.toLowerCase();
          return (
            client.firstName.toLowerCase().includes(q) ||
            client.lastName.toLowerCase().includes(q) ||
            client.email.toLowerCase().includes(q) ||
            client.phone.toLowerCase().includes(q) ||
            client.personalId.toLowerCase().includes(q)
          );
        })
      : clients;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Klienti</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Počet klientů: {filteredClients?.length ?? 0}
          </p>
        </div>
        <ClientForm onSubmit={handleCreate} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Hledat podle jména, emailu nebo telefonu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table>
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
          {filteredClients?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                Žádní klienti
              </TableCell>
            </TableRow>
          )}
          {filteredClients?.map((client) => (
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
