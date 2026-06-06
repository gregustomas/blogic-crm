import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const config: ChartConfig = {
  count: { label: "Smlouvy", color: "hsl(221 83% 53%)" },
};

export type MonthlyDataPoint = {
  key: string;
  label: string;
  count: number;
};

export function ContractsBarChart({ data }: { data: MonthlyDataPoint[] }) {
  return (
    <div className="lg:col-span-2 rounded-xl border bg-card p-5">
      <p className="font-medium mb-1">Smlouvy po měsících</p>
      <p className="text-sm text-muted-foreground mb-4">
        Počet podepsaných smluv za posledních 12 měsíců
      </p>
      <ChartContainer config={config} className="h-48 w-full">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
