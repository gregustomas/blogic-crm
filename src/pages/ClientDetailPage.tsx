import { useClient } from "@/hooks/useClients";
import { useContractsByClient } from "@/hooks/useContracts";
import { useAdvisors } from "@/hooks/useAdvisors";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailSkeleton } from "@/components/detail-skeleton";
import { PageError } from "@/components/ui/page-error";
import { UserForm } from "@/components/user/UserForm";
import { UserInfoGrid } from "@/components/user/UserInfoGrid";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import * as clientService from "@/services/clients";
import * as contractService from "@/services/contracts";
import { fullName, todayISO } from "@/lib/utils";
import type { UserFormData } from "@/lib/schemas";
import { toast } from "sonner";

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: client, loading, error } = useClient(id!);
  const { data: contracts } = useContractsByClient(id!);
  const { data: advisors } = useAdvisors();
  const today = todayISO();

  const handleUpdate = async (data: UserFormData) => {
    try {
      await clientService.update(id!, { ...data });
      toast.success("Klient úspěšně aktualizován");
    } catch {
      toast.error("Při úpravě došlo k chybě.");
    }
  };

  const handleDelete = async () => {
    try {
      const existing = await contractService.getByClientId(id!);
      if (existing.length > 0) {
        toast.error(`Klient má ${existing.length} smluv. Nejprve je smažte.`);
      } else {
        await clientService.deleteById(id!);
        toast.success("Klient úspěšně smazán");
        navigate("/clients");
      }
    } catch {
      toast.error("Při mazání došlo k chybě.");
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <PageError message="Nepodařilo se načíst klienta." />;
  if (!client) return <PageError message="Klient neexistuje." />;

  return (
    <div className="p-6 space-y-6 w-full overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            {fullName(client.firstName, client.lastName)}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Detail klienta</p>
        </div>
        <UserForm
          labels={{
            trigger: <Pencil className="h-4 w-4" />,
            dialogTitle: "Upravit klienta",
            description: "Upravte informace o klientovi.",
          }}
          defaultValues={client}
          triggerVariant="ghost"
          triggerSize="icon"
          onSubmit={handleUpdate}
        />
        <DeleteDialog
          title="Smazat klienta?"
          description="Tato akce nemůže být vrácena. Klient bude trvale odstraněn."
          onConfirm={handleDelete}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UserInfoGrid
          email={client.email}
          phone={client.phone}
          personalId={client.personalId}
        />

        {/* přehled smluv */}
        <div className="border-l-4 border-muted pl-4 flex flex-col gap-5">
          <p className="text-sm font-medium text-muted-foreground">
            Přehled smluv
          </p>
          {(() => {
            const total = contracts?.length ?? 0;
            const active =
              contracts?.filter(
                (c) => !c.validUntil || c.validUntil >= todayISO(),
              ).length ?? 0;
            const expired =
              contracts?.filter(
                (c) => !!c.validUntil && c.validUntil < todayISO(),
              ).length ?? 0;
            const rows = [
              { label: "Celkem", value: total, bar: "bg-foreground" },
              { label: "Platné", value: active, bar: "bg-green-500" },
              { label: "Prošlé", value: expired, bar: "bg-destructive" },
            ];
            return rows.map(({ label, value, bar }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${bar}`}
                    style={{
                      width: total > 0 ? `${(value / total) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* smlouvy */}
      <div className="min-w-0">
        <h2 className="text-lg font-semibold mb-4">Smlouvy</h2>
        {contracts?.length === 0 && (
          <p className="text-sm text-muted-foreground">Žádné smlouvy</p>
        )}
        <div className="flex flex-col divide-y rounded-lg border overflow-hidden">
          {contracts?.map((contract) => {
            const manager = advisors?.find((a) => a.id === contract.managerId);
            const isExpired =
              !!contract.validUntil && contract.validUntil < today;
            return (
              <div
                key={contract.id}
                onClick={() => navigate(`/contracts/${contract.id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-4 py-3 hover:bg-muted/50 cursor-pointer"
              >
                <div>
                  <p className="font-medium text-sm">
                    {contract.registrationNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {contract.institution}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground sm:text-right">
                  {manager && (
                    <p>{fullName(manager.firstName, manager.lastName)}</p>
                  )}
                  <p className={isExpired ? "text-destructive" : ""}>
                    {new Date(contract.validFrom).toLocaleDateString("cs-CZ")} —{" "}
                    {contract.validUntil
                      ? new Date(contract.validUntil).toLocaleDateString(
                          "cs-CZ",
                        )
                      : "neurčito"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
