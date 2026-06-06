import { Search } from "lucide-react";
import * as advisorService from "@/services/advisors";
import { getAgeFromPersonalId } from "@/lib/utils";
import type { UserFormData } from "@/lib/schemas";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAdvisors } from "@/hooks/useAdvisors";
import { UserForm } from "@/components/user/UserForm";
import { UserTable } from "@/components/user/UserTable";
import { ExportButton } from "@/components/ui/ExportButton";

async function checkDuplicates(
  email: string,
  personalId: string,
  excludeId?: string,
): Promise<boolean> {
  const [emailTaken, personalIdTaken] = await Promise.all([
    advisorService.isEmailTaken(email, excludeId),
    advisorService.isPersonalIdTaken(personalId, excludeId),
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

export default function AdvisorsPage() {
  const { data: advisors } = useAdvisors();
  const [search, setSearch] = useState("");

  const handleCreate = async (data: UserFormData) => {
    if (await checkDuplicates(data.email, data.personalId)) return;
    await advisorService.create({
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
    toast.success("Poradce úspěšně vytvořen");
  };

  const handleUpdate = async (id: string, data: UserFormData) => {
    if (await checkDuplicates(data.email, data.personalId, id)) return;
    await advisorService.update(id, {
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
    toast.success("Poradce úspěšně aktualizován");
  };

  const filteredAdvisors =
    search.length >= 3
      ? advisors?.filter((advisor) => {
          const q = search.toLowerCase();
          return (
            advisor.firstName.toLowerCase().includes(q) ||
            advisor.lastName.toLowerCase().includes(q) ||
            advisor.email.toLowerCase().includes(q) ||
            advisor.phone.toLowerCase().includes(q) ||
            advisor.personalId.toLowerCase().includes(q)
          );
        })
      : advisors;

  const exportRows =
    filteredAdvisors?.map((a) => ({
      Jmeno: a.firstName,
      Prijmeni: a.lastName,
      Email: a.email,
      Telefon: a.phone,
      "Rodne cislo": a.personalId,
      Vek: a.age,
    })) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Poradci</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Počet poradců: {filteredAdvisors?.length ?? 0}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            rows={exportRows}
            filename="poradci"
            pdfTitle="Seznam poradcu"
          />
          <UserForm
            labels={{
              trigger: "Přidat poradce",
              dialogTitle: "Přidat nového poradce",
              description: "Zadejte informace o novém poradci.",
            }}
            onSubmit={handleCreate}
          />
        </div>
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
        data={filteredAdvisors ?? []}
        basePath="/advisors"
        emptyMessage="Žádní poradci"
        onEdit={handleUpdate}
        onDelete={async (id) => {
          await advisorService.deleteById(id);
          toast.success("Poradce úspěšně smazán");
        }}
        editLabels={{
          dialogTitle: "Upravit poradce",
          description: "Upravte informace o poradci.",
        }}
        deleteDialogTitle="Smazat poradce"
        deleteDialogDescription="Opravdu chcete smazat tohoto poradce?"
      />
    </div>
  );
}
