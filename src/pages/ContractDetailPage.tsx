import { useContract } from "@/hooks/useContracts";
import { useClients } from "@/hooks/useClients";
import { useAdvisors } from "@/hooks/useAdvisors";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarCheck,
  CalendarX,
  Hash,
  Pencil,
  PenLine,
  ShieldCheck,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailSkeleton } from "@/components/detail-skeleton";
import { PageError } from "@/components/ui/page-error";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ContractsForm } from "@/components/contract/ContractsForm";
import * as contractService from "@/services/contracts";
import { cn, fullName, todayISO } from "@/lib/utils";
import type { ContractFormData } from "@/lib/schemas";
import { toast } from "sonner";

function formatDate(date: string | null) {
  if (!date) return "Neurčito";
  return new Date(date).toLocaleDateString("cs-CZ");
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("font-medium", valueClass)}>{value}</p>
      </div>
    </div>
  );
}

export default function ContractDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contract, loading, error } = useContract(id!);
  const { data: clients } = useClients();
  const { data: advisors } = useAdvisors();
  const today = todayISO();

  const handleUpdate = async (data: ContractFormData) => {
    const taken = await contractService.isRegistrationNumberTaken(
      data.registrationNumber,
      id!,
    );
    if (taken) {
      toast.error("Smlouva s tímto evidenčním číslem již existuje");
      return;
    }
    await contractService.update(id!, {
      ...data,
      validUntil: data.validUntil || null,
    });
    toast.success("Smlouva úspěšně upravena");
  };

  const handleDelete = async () => {
    await contractService.deleteById(id!);
    toast.success("Smlouva úspěšně smazána");
    navigate("/contracts");
  };

  if (loading) return <DetailSkeleton infoCount={5} />;
  if (error) return <PageError message="Nepodařilo se načíst smlouvu." />;
  if (!contract) return <PageError message="Smlouva neexistuje." />;

  const client = clients?.find((c) => c.id === contract.clientId);
  const manager = advisors?.find((a) => a.id === contract.managerId);
  const otherParticipants = (advisors ?? []).filter(
    (a) =>
      contract.participantIds.includes(a.id) && a.id !== contract.managerId,
  );

  const isExpired = !!contract.validUntil && contract.validUntil < today;
  const isIndefinite = !contract.validUntil;

  const statusLabel = isExpired
    ? "Prošlá"
    : isIndefinite
      ? "Na dobu neurčitou"
      : "Platná";
  const statusColor = isExpired
    ? "text-destructive"
    : isIndefinite
      ? "text-muted-foreground"
      : "text-green-600";
  const statusBarColor = isExpired
    ? "bg-destructive"
    : isIndefinite
      ? "bg-muted-foreground"
      : "bg-green-500";

  const start = new Date(contract.validFrom).getTime();
  const end = contract.validUntil
    ? new Date(contract.validUntil).getTime()
    : null;
  const now = new Date(today).getTime();
  const progress =
    end && end > start
      ? Math.min(Math.round(((now - start) / (end - start)) * 100), 100)
      : 0;
  const diffDays = end
    ? Math.ceil(Math.abs(end - now) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="p-6 space-y-6 w-full overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate">
            {contract.registrationNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {contract.institution}
          </p>
        </div>
        <ContractsForm
          labels={{
            trigger: <Pencil className="h-4 w-4" />,
            dialogTitle: "Upravit smlouvu",
            description: "Upravte údaje smlouvy",
          }}
          triggerVariant="ghost"
          triggerSize="icon"
          defaultValues={{ ...contract, validUntil: contract.validUntil ?? "" }}
          onSubmit={handleUpdate}
        />
        <DeleteDialog
          title="Smazat smlouvu?"
          description="Tato akce nemůže být vrácena. Smlouva bude trvale odstraněna."
          onConfirm={handleDelete}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* info */}
        <div className="lg:col-span-2 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={Hash}
              label="Číslo smlouvy"
              value={contract.registrationNumber}
            />
            <InfoRow
              icon={Building2}
              label="Instituce"
              value={contract.institution}
            />
            <InfoRow
              icon={PenLine}
              label="Datum podpisu"
              value={formatDate(contract.signedAt)}
            />
            <InfoRow
              icon={CalendarCheck}
              label="Platnost od"
              value={formatDate(contract.validFrom)}
            />
            <InfoRow
              icon={CalendarX}
              label="Platnost do"
              value={formatDate(contract.validUntil)}
              valueClass={isExpired ? "text-destructive" : undefined}
            />
          </div>
        </div>

        {/* status */}
        <div className="border-l-4 border-muted pl-4 flex flex-col gap-5">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full shrink-0",
                statusBarColor,
              )}
            />
            <span className={cn("font-semibold text-sm", statusColor)}>
              {statusLabel}
            </span>
          </div>
          {!isIndefinite && diffDays !== null && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isExpired ? "Prošlo před" : "Zbývá"}
                </span>
                <span className="font-semibold">{diffDays} dní</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    statusBarColor,
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* osoby */}
      <div className="min-w-0 space-y-4">
        <h2 className="text-lg font-semibold">Osoby</h2>
        <div className="flex flex-col divide-y rounded-lg border overflow-hidden">
          {client && (
            <div
              onClick={() => navigate(`/clients/${client.id}`)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
            >
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium text-sm">
                  {fullName(client.firstName, client.lastName)}
                </p>
                <p className="text-xs text-muted-foreground">Klient</p>
              </div>
            </div>
          )}
          {manager && (
            <div
              onClick={() => navigate(`/advisors/${manager.id}`)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-medium text-sm">
                  {fullName(manager.firstName, manager.lastName)}
                </p>
                <p className="text-xs text-muted-foreground">Správce smlouvy</p>
              </div>
            </div>
          )}
          {otherParticipants.map((participant) => (
            <div
              key={participant.id}
              onClick={() => navigate(`/advisors/${participant.id}`)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
            >
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium text-sm">
                  {fullName(participant.firstName, participant.lastName)}
                </p>
                <p className="text-xs text-muted-foreground">Účastník</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
