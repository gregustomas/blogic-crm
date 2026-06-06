import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PieChart, Pie } from "recharts";

const config: ChartConfig = {
  active: { label: "Aktivní", color: "#22c55e" },
  expired: { label: "Prošlé", color: "#ef4444" },
};

export function ContractsPieChart({
  activeCount,
  expiredCount,
}: {
  activeCount: number;
  expiredCount: number;
}) {
  const data = [
    { name: "active", value: activeCount, fill: config.active.color },
    { name: "expired", value: expiredCount, fill: config.expired.color },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="font-medium mb-1">Stav smluv</p>
      <p className="text-sm text-muted-foreground mb-4">
        Poměr aktivních a prošlých smluv
      </p>
      {activeCount + expiredCount === 0 ? (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          Žádné smlouvy
        </div>
      ) : (
        <ChartContainer config={config} className="h-48 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
}
