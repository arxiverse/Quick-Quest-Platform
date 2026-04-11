import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Surface } from "../../home.ui";
import {
  analysisCategoryPoints,
  analysisFlows,
  analysisMetrics,
  analysisStatusPoints,
  analysisTrendPoints,
} from "./analysis";

type TooltipRow = {
  color?: string;
  dataKey?: string | number;
  name?: string;
  value?: string | number;
  payload?: {
    fill?: string;
  };
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipRow[]; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[10px] border border-base-300/70 bg-base-100/95 px-3 py-2 shadow-lg backdrop-blur">
      {label && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={`${entry.dataKey}-${entry.name}`} className="flex items-center gap-2 text-sm text-base-content">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color ?? entry.payload?.fill ?? "#A046FF" }} />
            <span className="font-medium text-base-content/65">{entry.name}</span>
            <span className="font-bold text-base-content">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisComponent() {
  return (
    <div className="min-w-0 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analysisMetrics.map((metric) => (
          <Surface key={metric.label} className="p-5">
            <p className="text-sm font-semibold text-base-content/55">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold text-base-content">{metric.value}</p>
            <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold text-black ${metric.tone}`}>{metric.delta}</span>
          </Surface>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Trend Mingguan</p>
              <h2 className="mt-2 text-xl font-bold text-base-content">Pergerakan Quest & Akurasi</h2>
            </div>
            <div className="badge badge-ghost border-base-300 bg-base-100 text-base-content/65">7 hari terakhir</div>
          </div>

          <div className="mt-6 h-[320px] min-h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={analysisTrendPoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 12 }} />
                <Line type="monotone" dataKey="completed" name="Quest Selesai" stroke="#A046FF" strokeWidth={3} dot={{ r: 4, fill: "#A046FF" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="active" name="Quest Aktif" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="accuracy" name="Akurasi" stroke="#84CC16" strokeWidth={3} dot={{ r: 4, fill: "#84CC16" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Flow Monitoring</p>
              <h2 className="mt-2 text-xl font-bold text-base-content">Pipeline Quest</h2>
            </div>
            <div className="badge badge-ghost border-base-300 bg-base-100">Realtime</div>
          </div>

          <div className="mt-6 space-y-5">
            {analysisFlows.map((flow) => (
              <div key={flow.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-base-content">{flow.label}</p>
                  <span className="text-xs font-bold text-base-content/55">{flow.percentage}%</span>
                </div>
                <progress className="progress progress-primary h-3 w-full" value={flow.percentage} max="100" />
                <p className="mt-2 text-sm text-base-content/60">{flow.note}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Surface className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Distribusi Quest</p>
              <h2 className="mt-2 text-xl font-bold text-base-content">Kategori Paling Aktif</h2>
            </div>
            <div className="badge badge-ghost border-base-300 bg-base-100 text-base-content/65">Dummy data</div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-1 2xl:grid-cols-[0.92fr_1.08fr]">
            <div className="h-[250px] min-h-[250px] w-full min-w-0">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Tooltip content={<ChartTooltip />} />
                  <Pie
                    data={analysisCategoryPoints}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {analysisCategoryPoints.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="min-w-0 space-y-3">
              {analysisCategoryPoints.map((category) => (
                <div key={category.name} className="flex items-center justify-between gap-3 rounded-[12px] border border-base-300/70 bg-base-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full" style={{ backgroundColor: category.fill }} />
                    <span className="text-sm font-semibold text-base-content">{category.name}</span>
                  </div>
                  <span className="text-sm font-bold text-base-content/75">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        <Surface className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Status Board</p>
              <h2 className="mt-2 text-xl font-bold text-base-content">Open, Match, Done, Issue</h2>
            </div>
            <div className="badge badge-ghost border-base-300 bg-base-100 text-base-content/65">Live snapshot</div>
          </div>

          <div className="mt-6 h-[320px] min-h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analysisStatusPoints} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="total" name="Jumlah" radius={[10, 10, 0, 0]}>
                  {analysisStatusPoints.map((entry) => {
                    const fills: Record<string, string> = {
                      Open: "#38BDF8",
                      Match: "#A046FF",
                      Done: "#84CC16",
                      Issue: "#F87171",
                    };
                    return <Cell key={entry.label} fill={fills[entry.label] ?? "#A046FF"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default AnalysisComponent;
