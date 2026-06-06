type Variant = "default" | "success" | "warning" | "danger";

const iconColors: Record<Variant, string> = {
  default: "text-muted-foreground bg-muted",
  success: "text-green-600 bg-green-50 dark:bg-green-950",
  warning: "text-orange-500 bg-orange-50 dark:bg-orange-950",
  danger: "text-red-500 bg-red-50 dark:bg-red-950",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  variant?: Variant;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-start gap-4">
      <div className={`rounded-lg p-2.5 shrink-0 ${iconColors[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
