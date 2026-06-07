import { useAdvisor } from "@/hooks/useAdvisors";
import { useContractsByAdvisor } from "@/hooks/useContracts";
import { useClients } from "@/hooks/useClients";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Mail,
  Pencil,
  Phone,
  IdCard,
  CalendarDays,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailSkeleton } from "@/components/detail-skeleton";
import { PageError } from "@/components/ui/page-error";
import { UserForm } from "@/components/user/UserForm";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import * as advisorService from "@/services/advisors";
import { getAgeFromPersonalId, fullName, todayISO } from "@/lib/utils";
import type { UserFormData } from "@/lib/schemas";
import { toast } from "sonner";

export default function AdvisorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: advisor, loading, error } = useAdvisor(id!);
  const { data: contracts } = useContractsByAdvisor(id!);
  const { data: clients } = useClients();
  const today = todayISO();
  const [roleTab, setRoleTab] = useState<"all" | "manager" | "participant">(
    "all",
  );

  const handleUpdate = async (data: UserFormData) => {
    await advisorService.update(id!, {
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
    toast.success("Poradce úspěšně aktualizován");
  };

  const handleDelete = async () => {
    await advisorService.deleteById(id!);
    toast.success("Poradce úspěšně smazán");
    navigate("/advisors");
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <PageError message="Nepodařilo se načíst poradce." />;
  if (!advisor) return <PageError message="Poradce neexistuje." />;

  return (
    <div className="p-6 space-y-6 w-full overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            {fullName(advisor.firstName, advisor.lastName)}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Detail poradce</p>
        </div>
        <UserForm
          labels={{
            trigger: <Pencil className="h-4 w-4" />,
            dialogTitle: "Upravit poradce",
            description: "Upravte informace o poradci.",
          }}
          defaultValues={advisor}
          triggerVariant="ghost"
          triggerSize="icon"
          onSubmit={handleUpdate}
        />
        <DeleteDialog
          title="Smazat poradce?"
          description="Tato akce nemůže být vrácena. Poradce bude trvale odstraněn."
          onConfirm={handleDelete}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* poradce info */}
        <div className="lg:col-span-2 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium break-all">{advisor.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="font-medium">{advisor.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IdCard className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Rodné číslo</p>
                <p className="font-medium">{advisor.personalId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Věk</p>
                <p className="font-medium">{advisor.age} let</p>
              </div>
            </div>
          </div>
        </div>

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
      <div className="min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Smlouvy</h2>
          <Tabs
            value={roleTab}
            onValueChange={(v) => setRoleTab(v as typeof roleTab)}
          >
            <TabsList>
              <TabsTrigger value="all">Všechny</TabsTrigger>
              <TabsTrigger value="manager">Správce</TabsTrigger>
              <TabsTrigger value="participant">Účastník</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {(() => {
          const filtered = (contracts ?? []).filter((c) => {
            if (roleTab === "manager") return c.managerId === id;
            if (roleTab === "participant") return c.managerId !== id;
            return true;
          });
          if (filtered.length === 0)
            return (
              <p className="text-sm text-muted-foreground">Žádné smlouvy</p>
            );
          return (
            <div className="flex flex-col divide-y rounded-lg border overflow-hidden">
              {filtered.map((contract) => {
                const client = clients?.find((c) => c.id === contract.clientId);
                const isExpired =
                  !!contract.validUntil && contract.validUntil < today;
                const isManager = contract.managerId === id;
                return (
                  <div
                    key={contract.id}
                    onClick={() => navigate(`/contracts/${contract.id}`)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-4 py-3 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {isManager ? (
                              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {isManager ? "Správce smlouvy" : "Účastník smlouvy"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div>
                        <p className="font-medium text-sm">
                          {contract.registrationNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {contract.institution}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground sm:text-right">
                      {client && (
                        <p>{fullName(client.firstName, client.lastName)}</p>
                      )}
                      <p className={isExpired ? "text-destructive" : ""}>
                        {new Date(contract.validFrom).toLocaleDateString(
                          "cs-CZ",
                        )}{" "}
                        —{" "}
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
          );
        })()}
      </div>
    </div>
  );
}
