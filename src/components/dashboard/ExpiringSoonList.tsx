import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fullName } from "@/lib/utils";
import type { Contract, Client } from "@/types";

function daysUntil(date: string, today: string): number {
  const diff = new Date(date).getTime() - new Date(today).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ days }: { days: number }) {
  const urgent = days <= 7;
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        urgent ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
      }`}
    >
      {days === 0 ? "Dnes" : days === 1 ? "Zítra" : `Za ${days} dní`}
    </span>
  );
}

export function ExpiringSoonList({
  contracts,
  clients,
  today,
}: {
  contracts: Contract[];
  clients: Client[];
  today: string;
}) {
  return (
    <div className="lg:col-span-2 rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-medium">Smlouvy expirující brzy</p>
          <p className="text-sm text-muted-foreground">
            Vyprší v následujících 30 dnech
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/contracts">
            Všechny smlouvy
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Žádné smlouvy v nejbližších 30 dnech nevyprší
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {contracts.map((contract) => {
            const client = clients.find((c) => c.id === contract.clientId);
            const days = daysUntil(contract.validUntil!, today);
            return (
              <Link
                key={contract.id}
                to={`/contracts/${contract.id}`}
                className="flex items-center justify-between py-3 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-md bg-orange-50 dark:bg-orange-950 p-1.5 shrink-0">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {contract.registrationNumber}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {client
                        ? fullName(client.firstName, client.lastName)
                        : "—"}{" "}
                      · {contract.institution}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <ExpiryBadge days={days} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
