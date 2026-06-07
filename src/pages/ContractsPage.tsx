import { ContractsTable } from "@/components/contract/ContractsTable";
import { TableSkeleton } from "@/components/table-skeleton";
import { Input } from "@/components/ui/input";
import { useAdvisors } from "@/hooks/useAdvisors";
import { useClients } from "@/hooks/useClients";
import { useContracts } from "@/hooks/useContracts";
import { Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";
import * as contractService from "@/services/contracts";
import { toast } from "sonner";
import { ContractsForm } from "@/components/contract/ContractsForm";
import type { ContractFormData } from "@/lib/schemas";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { todayISO, fullName } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { formatExportDate } from "@/lib/export";

type TabFilter = "all" | "active" | "expired";

export default function ContractsPage() {
  const { data: clients } = useClients();
  const { data: advisors } = useAdvisors();
  const { data: contracts, loading } = useContracts();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabFilter>("all");

  const handleCreate = async (data: ContractFormData) => {
    try {
      const taken = await contractService.isRegistrationNumberTaken(data.registrationNumber);
      if (taken) { toast.error("Smlouva s tímto evidenčním číslem již existuje"); return; }
      await contractService.create({ ...data, validUntil: data.validUntil || null });
      toast.success("Smlouva úspěšně vytvořena");
    } catch {
      toast.error("Při vytváření došlo k chybě.");
    }
  };

  const handleUpdate = async (id: string, data: ContractFormData) => {
    try {
      const taken = await contractService.isRegistrationNumberTaken(data.registrationNumber, id);
      if (taken) { toast.error("Smlouva s tímto evidenčním číslem již existuje"); return; }
      await contractService.update(id, { ...data, validUntil: data.validUntil || null });
      toast.success("Smlouva úspěšně upravena");
    } catch {
      toast.error("Při úpravě došlo k chybě.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contractService.deleteById(id);
      toast.success("Smlouva úspěšně smazána");
    } catch {
      toast.error("Při mazání došlo k chybě.");
    }
  };

  if (loading) return <TableSkeleton />;

  const today = todayISO();

  const tabFiltered = contracts?.filter((contract) => {
    if (tab === "active")
      return !contract.validUntil || contract.validUntil >= today;
    if (tab === "expired")
      return !!contract.validUntil && contract.validUntil < today;
    return true;
  });

  const filteredContracts =
    search.length >= 3
      ? tabFiltered?.filter((contract) => {
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
      : tabFiltered;

  const exportRows =
    filteredContracts?.map((c) => {
      const client = clients?.find((x) => x.id === c.clientId);
      const manager = advisors?.find((x) => x.id === c.managerId);
      return {
        ID: c.registrationNumber,
        Instituce: c.institution,
        Klient: client ? fullName(client.firstName, client.lastName) : "",
        Spravce: manager ? fullName(manager.firstName, manager.lastName) : "",
        Podepsano: formatExportDate(c.signedAt),
        "Platnost od": formatExportDate(c.validFrom),
        "Platnost do": formatExportDate(c.validUntil),
      };
    }) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Smlouvy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Počet smluv: {filteredContracts?.length ?? 0}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            rows={exportRows}
            filename="smlouvy"
            pdfTitle="Seznam smluv"
          />
          <ContractsForm
            labels={{
              trigger: (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Přidat smlouvu
                </>
              ),
              dialogTitle: "Přidat smlouvu",
              description: "Vyplňte údaje nové smlouvy",
            }}
            onSubmit={handleCreate}
          />
        </div>
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

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabFilter)}>
        <TabsList>
          <TabsTrigger value="all">Všechny</TabsTrigger>
          <TabsTrigger value="active">Platné</TabsTrigger>
          <TabsTrigger value="expired">Prošlé</TabsTrigger>
        </TabsList>
      </Tabs>

      <ContractsTable
        data={filteredContracts ?? []}
        clients={clients ?? []}
        advisors={advisors ?? []}
        emptyMessage="Žádné smlouvy nenalezeny"
        onDelete={handleDelete}
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
