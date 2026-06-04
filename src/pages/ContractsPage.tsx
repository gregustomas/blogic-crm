import { ContractsTable } from "@/components/contract/ContractsTable";
import { Input } from "@/components/ui/input";
import { useAdvisors } from "@/hooks/useAdvisors";
import { useClients } from "@/hooks/useClients";
import { useContracts } from "@/hooks/useContracts";
import { Pencil, Search } from "lucide-react";
import { useState } from "react";
import * as contractService from "@/services/contracts";
import { toast } from "sonner";
import { ContractsForm } from "@/components/contract/ContractsForm";
import type { ContractFormData } from "@/lib/schemas";

export default function ContractsPage() {
  const { data: clients } = useClients();
  const { data: advisors } = useAdvisors();
  const { data: contracts } = useContracts();
  const [search, setSearch] = useState("");

  const filteredContracts =
    search.length >= 3
      ? contracts?.filter((contract) => {
          const q = search.toLowerCase();
          const client = clients?.find((c) => c.id === contract.clientId);
          const manager = advisors?.find((a) => a.id === contract.managerId);
          return (
            contract.registrationNumber.toLowerCase().includes(q) ||
            contract.institution.toLowerCase().includes(q) ||
            `${client?.firstName ?? ""} ${client?.lastName ?? ""}`
              .toLowerCase()
              .includes(q) ||
            `${manager?.firstName ?? ""} ${manager?.lastName ?? ""}`
              .toLowerCase()
              .includes(q)
          );
        })
      : contracts;

  const handleCreate = async (data: ContractFormData) => {
    const taken = await contractService.isRegistrationNumberTaken(
      data.registrationNumber,
    );
    if (taken) {
      toast.error("Smlouva s tímto evidenčním číslem již existuje");
      return;
    }
    await contractService.create({
      ...data,
      validUntil: data.validUntil || null,
    });
    toast.success("Smlouva úspěšně vytvořena");
  };

  const handleUpdate = async (id: string, data: ContractFormData) => {
    const taken = await contractService.isRegistrationNumberTaken(
      data.registrationNumber,
      id,
    );
    if (taken) {
      toast.error("Smlouva s tímto evidenčním číslem již existuje");
      return;
    }
    await contractService.update(id, {
      ...data,
      validUntil: data.validUntil || null,
    });
    toast.success("Smlouva úspěšně upravena");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Smlouvy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Počet smluv: {filteredContracts?.length ?? 0}
          </p>
        </div>
        <ContractsForm
          labels={{
            trigger: "Přidat smlouvu",
            dialogTitle: "Přidat smlouvu",
            description: "Vyplňte údaje nové smlouvy",
          }}
          onSubmit={handleCreate}
        />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Hledat podle čísla smlouvy nebo instituce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ContractsTable
        data={filteredContracts ?? []}
        clients={clients ?? []}
        advisors={advisors ?? []}
        emptyMessage="Žádné smlouvy nenalezeny"
        onDelete={(id) => {
          contractService.deleteById(id);
          toast.success("Smlouva úspěšně smazána");
        }}
        editAction={(contract) => (
          <ContractsForm
            labels={{
              trigger: <Pencil className="h-4 w-4" />,
              dialogTitle: "Upravit smlouvu",
              description: "Upravte údaje smlouvy",
            }}
            triggerVariant="ghost"
            triggerSize="icon"
            defaultValues={{
              ...contract,
              validUntil: contract.validUntil ?? "",
            }}
            onSubmit={(data) => handleUpdate(contract.id, data)}
          />
        )}
      />
    </div>
  );
}
