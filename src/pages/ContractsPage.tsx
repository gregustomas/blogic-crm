import { ContractsTable } from "@/components/contract/ContractsTable";
import { Input } from "@/components/ui/input";
import { useAdvisors } from "@/hooks/useAdvisors";
import { useClients } from "@/hooks/useClients";
import { useContracts } from "@/hooks/useContracts";
import { Search } from "lucide-react";
import { useState } from "react";
import * as contractService from "@/services/contracts";
import { toast } from "sonner";
import { ContractsForm } from "@/components/contract/ContractsForm";

export default function ContractsPage() {
  const { data: clients } = useClients();
  const { data: advisors } = useAdvisors();
  const { data: contracts } = useContracts();
  const [search, setSearch] = useState("");

  const filteredContracts =
    search.length >= 3
      ? contracts?.filter((contract) => {
          const q = search.toLowerCase();
          return (
            contract.registrationNumber.toLowerCase().includes(q) ||
            contract.institution.toLowerCase().includes(q)
          );
        })
      : contracts;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Smlouvy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Počet smluv: {filteredContracts?.length ?? 0}
          </p>
        </div>
        <ContractsForm />
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
        editAction={() => null}
      />
    </div>
  );
}
