import { Search } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import * as clientService from "@/services/clients";
import { getAgeFromPersonalId } from "@/lib/utils";
import type { UserFormData } from "@/lib/schemas";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserForm } from "@/components/user/UserForm";
import { UserTable } from "@/components/user/UserTable";

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
  const [search, setSearch] = useState("");

  const handleCreate = async (data: UserFormData) => {
    if (await checkDuplicates(data.email, data.personalId)) return;
    await clientService.create({
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
    toast.success("Klient úspěšně vytvořen");
  };

  const handleUpdate = async (id: string, data: UserFormData) => {
    if (await checkDuplicates(data.email, data.personalId, id)) return;
    await clientService.update(id, {
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
    toast.success("Klient úspěšně aktualizován");
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
        <UserForm
          labels={{
            trigger: "Přidat klienta",
            dialogTitle: "Přidat nového klienta",
            description: "Zadejte informace o novém klientovi.",
          }}
          onSubmit={handleCreate}
        />
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

      <UserTable
        data={filteredClients ?? []}
        basePath="/clients"
        emptyMessage="Žádní klienti"
        onEdit={handleUpdate}
        onDelete={async (id) => {
          await clientService.deleteById(id);
          toast.success("Klient úspěšně smazán");
        }}
        editLabels={{
          dialogTitle: "Upravit klienta",
          description: "Upravte informace o klientovi.",
        }}
        deleteDialogTitle="Smazat klienta"
        deleteDialogDescription="Opravdu chcete smazat tohoto klienta?"
      />
    </div>
  );
}
