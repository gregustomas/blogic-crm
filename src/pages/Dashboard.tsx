import { useMemo } from "react";
import { useContracts } from "@/hooks/useContracts";
import { useClients } from "@/hooks/useClients";
import { useAdvisors } from "@/hooks/useAdvisors";
import { todayISO } from "@/lib/utils";
import {
  FileText,
  Users,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ContractsBarChart } from "@/components/dashboard/ContractsBarChart";
import { ContractsPieChart } from "@/components/dashboard/ContractsPieChart";
import { ExpiringSoonList } from "@/components/dashboard/ExpiringSoonList";
import { QuickActions } from "@/components/dashboard/QuickActions";

const today = todayISO();

const in30ISO = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
})();

export default function Dashboard() {
  const { data: contracts } = useContracts();
  const { data: clients } = useClients();
  const { data: advisors } = useAdvisors();

  const activeContracts = contracts.filter(
    (c) => !c.validUntil || c.validUntil >= today,
  );

  const expiredContracts = contracts.filter(
    (c) => c.validUntil && c.validUntil < today,
  );

  const noExpiryCount = activeContracts.filter((c) => !c.validUntil).length;

  const expiringSoon = useMemo(
    () =>
      contracts
        .filter(
          (c) =>
            c.validUntil && c.validUntil >= today && c.validUntil <= in30ISO,
        )
        .sort((a, b) => a.validUntil!.localeCompare(b.validUntil!))
        .slice(0, 6),
    [contracts],
  );

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (11 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("cs-CZ", { month: "short" });
      return { key, label, count: 0 };
    });
    contracts.forEach((c) => {
      const key = c.signedAt.substring(0, 7);
      const slot = months.find((m) => m.key === key);
      if (slot) slot.count++;
    });
    return months;
  }, [contracts]);

  const todayLabel = new Date().toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Přehled</h1>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {todayLabel}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Celkem smluv"
          value={contracts.length}
          icon={FileText}
        />
        <StatCard
          label="Aktivní smlouvy"
          value={activeContracts.length}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          label="Vyprší za 30 dní"
          value={expiringSoon.length}
          icon={AlertTriangle}
          variant={expiringSoon.length > 0 ? "warning" : "default"}
        />
        <StatCard label="Klienti" value={clients.length} icon={Users} />
        <StatCard label="Poradci" value={advisors.length} icon={UserCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ContractsBarChart data={monthlyData} />
        <ContractsPieChart
          activeCount={activeContracts.length}
          expiredCount={expiredContracts.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ExpiringSoonList
          contracts={expiringSoon}
          clients={clients}
          today={today}
        />
        <QuickActions
          expiredCount={expiredContracts.length}
          noExpiryCount={noExpiryCount}
        />
      </div>
    </div>
  );
}
