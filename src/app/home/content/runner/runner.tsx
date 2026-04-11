import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn, Surface } from "../../home.ui";
import {
  runnerAvailabilitySchedule,
  runnerCareerMetrics,
  runnerEarningTrajectory,
  runnerFocusInsight,
  runnerMembers,
  runnerReliabilityBadges,
  runnerSkillInventory,
} from "./runner";

type TooltipRow = {
  color?: string;
  dataKey?: string | number;
  name?: string;
  value?: string | number;
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
            <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color ?? "#A046FF" }} />
            <span className="font-medium text-base-content/65">{entry.name}</span>
            <span className="font-bold text-base-content">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function skillLevelClass(level: "Q1" | "Q2" | "Q3") {
  if (level === "Q1") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (level === "Q2") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

function availabilityClass(status: "Online" | "Limited" | "Offline") {
  if (status === "Online") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "Limited") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#FECACA] text-[#991B1B]";
}

function memberStatusClass(status: "Ready" | "On Quest" | "Standby" | "Need Brief") {
  if (status === "Ready") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "On Quest") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (status === "Standby") {
    return "bg-[#E9D5FF] text-[#6D28D9]";
  }
  return "bg-[#FECACA] text-[#991B1B]";
}

function RunnerComponent() {
  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">Runner Career Center</p>
            <h1 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">Identity Kerja, Shift, dan Performa Penghasilan</h1>
          </div>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">Dummy data simulation</span>
        </div>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {runnerCareerMetrics.map((metric) => (
          <Surface key={metric.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{metric.label}</p>
            <p className="mt-2 text-xl font-bold text-base-content">{metric.value}</p>
            <span className={cn("mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-black", metric.tone)}>{metric.hint}</span>
          </Surface>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Skill Inventory</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Skill + Level Q1-Q3</h2>
          <div className="mt-3 space-y-2.5">
            {runnerSkillInventory.map((skill) => (
              <div key={skill.skill} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{skill.skill}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", skillLevelClass(skill.level))}>{skill.level}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/65">
                  <span>{skill.pp}</span>
                  <span>|</span>
                  <span>Completion {skill.completionRate}</span>
                  <span>|</span>
                  <span>Trend {skill.trend}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">{runnerFocusInsight.title}</p>
            <p className="mt-1 text-sm font-medium text-base-content/80">{runnerFocusInsight.description}</p>
            <p className="mt-1.5 text-xs font-semibold text-base-content/60">Demand Window: {runnerFocusInsight.demandWindow}</p>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Availability Schedule</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Shift Setup Mirip Ojol</h2>
          <div className="mt-3 space-y-2">
            {runnerAvailabilitySchedule.map((slot) => (
              <div key={slot.day} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{slot.day}</p>
                  <span className="text-xs text-base-content/60">Pagi / Siang / Malam</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={cn("rounded-[8px] px-2 py-1 text-[11px] font-semibold", availabilityClass(slot.morning))}>Pagi: {slot.morning}</span>
                  <span className={cn("rounded-[8px] px-2 py-1 text-[11px] font-semibold", availabilityClass(slot.afternoon))}>Siang: {slot.afternoon}</span>
                  <span className={cn("rounded-[8px] px-2 py-1 text-[11px] font-semibold", availabilityClass(slot.night))}>Malam: {slot.night}</span>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Earning Trajectory</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Pertumbuhan Income Runner</h2>
          <div className="mt-4 h-[300px] min-h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={runnerEarningTrajectory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#A046FF" strokeWidth={3} dot={{ r: 4, fill: "#A046FF" }} />
                <Line type="monotone" dataKey="quests" name="Quest Selesai" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 h-[190px] min-h-[190px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={runnerEarningTrajectory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="income" name="Income Bar" fill="#6B21FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Reliability Badge</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Badge Konsistensi Kerja Runner</h2>
          <div className="mt-3 space-y-2.5">
            {runnerReliabilityBadges.map((badge) => (
              <div key={badge.name} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{badge.name}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", badge.tone)}>Active</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{badge.description}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Runner Roster</p>
        <h2 className="mt-1 text-lg font-bold text-base-content">Pool Aktif untuk Distribusi Quest</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {runnerMembers.map((member) => (
            <div key={member.name} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-base-content">{member.name}</p>
                <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", memberStatusClass(member.currentStatus))}>{member.currentStatus}</span>
              </div>
              <p className="text-xs text-base-content/65">{member.primarySkill}</p>
              <p className="mt-1 text-xs text-base-content/65">Area: {member.location}</p>
              <p className="mt-1 text-xs font-semibold text-base-content/70">Reliability: {member.reliabilityScore}</p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

export default RunnerComponent;
