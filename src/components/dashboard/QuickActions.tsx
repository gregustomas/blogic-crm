import { Link } from "react-router-dom";
import { ArrowRight, FilePlus, UserPlus, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions({
  expiredCount,
  noExpiryCount,
}: {
  expiredCount: number;
  noExpiryCount: number;
}) {
  const actions = [
    { label: "Správa smluv", to: "/contracts", icon: FilePlus },
    { label: "Správa klientů", to: "/clients", icon: UserPlus },
    { label: "Správa poradců", to: "/advisors", icon: UserRoundPlus },
  ];

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="font-medium mb-1">Rychlé akce</p>
      <p className="text-sm text-muted-foreground mb-4">Přejít na správu záznamů</p>

      <div className="space-y-2">
        {actions.map(({ label, to, icon: Icon }) => (
          <Button
            key={to}
            variant="outline"
            className="w-full justify-start gap-2 h-11"
            asChild
          >
            <Link to={to}>
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
          </Button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
          Souhrn
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Prošlé smlouvy</span>
          <span className="font-medium tabular-nums">{expiredCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Bez konce platnosti</span>
          <span className="font-medium tabular-nums">{noExpiryCount}</span>
        </div>
      </div>
    </div>
  );
}
