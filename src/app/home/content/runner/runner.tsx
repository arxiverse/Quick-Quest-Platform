import { useEffect, useState } from "react";
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
import { PartyLobbyRoom } from "./page/party-lobby-room";

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

const runnerOpenParties = [
  { id: "P-101", title: "Event Organizer Staff", giver: "Neo Comm", slotFilled: 3, slotTotal: 5, reward: "Rp 350.000", match: 92 },
  { id: "P-102", title: "Bongkar Muat Gudang", giver: "Sinar Jaya", slotFilled: 1, slotTotal: 4, reward: "Rp 210.000", match: 78 },
];

type RunnerSubView = { view: "PartyLobbyRoom"; payload: { partyId: string } };

const RUNNER_SUBVIEW_STORAGE_KEY = "nvrs-qqm-runner-subview-v1";

function resolveInitialSubView(): RunnerSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RUNNER_SUBVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RunnerSubView;
  } catch {
    return null;
  }
}

function RunnerOpenPartiesWidget({ onJoinParty }: { onJoinParty?: (id: string) => void }) {
  return (
    <Surface className="p-4 sm:p-5 border border-[#A046FF]/30 bg-gradient-to-br from-[#A046FF]/5 to-transparent">
       <div className="mb-2 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#A046FF] text-[12px] text-white shadow-sm shadow-[#A046FF]/40">🎉</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A046FF]">Party Lobbies</p>
            <h2 className="mt-0.5 text-base font-bold text-base-content leading-tight">Group Quests Terbuka di Sekitarmu</h2>
          </div>
       </div>
       <div className="mt-3 grid gap-3 sm:grid-cols-2">
         {runnerOpenParties.map((party) => {
           const slots = Array.from({ length: party.slotTotal }, (_, i) => i < party.slotFilled);
           return (
             <div key={party.id} className="rounded-[10px] border border-base-300 bg-base-100 p-3 shadow-sm hover:border-[#A046FF]/50 transition-colors">
               <div className="flex items-center justify-between gap-2">
                 <div>
                   <p className="text-sm font-bold text-base-content">{party.title}</p>
                   <p className="text-[11px] font-semibold text-base-content/60">{party.giver} • Match {party.match}%</p>
                 </div>
                 <span className="rounded bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-bold text-[#166534]">{party.reward}</span>
               </div>
               
               <div className="mt-3 flex items-center justify-between gap-2 border-t border-base-200 pt-3">
                 <div className="flex -space-x-2">
                   {slots.map((filled, i) => (
                      <div key={i} className="relative transition-all">
                        {filled ? (
                          <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#A046FF] to-[#38BDF8] text-[9px] font-bold text-white shadow ring-2 ring-base-100">
                            R{i + 1}
                          </div>
                        ) : (
                          <div className="flex size-7 items-center justify-center rounded-full border border-dashed border-base-300 bg-base-200 text-[10px] text-base-content/40 ring-1 ring-base-100">
                            +
                          </div>
                        )}
                      </div>
                   ))}
                   <div className="ml-3 pl-3 text-[10px] font-semibold text-base-content/60 self-center">
                     {party.slotFilled}/{party.slotTotal} Ready
                   </div>
                 </div>
                 <button type="button" onClick={() => onJoinParty?.(party.id)} className="btn h-7 min-h-7 border-none bg-[#A046FF] px-3 py-0 text-[10px] font-bold text-white shadow hover:opacity-90">Join Lobby</button>
               </div>
             </div>
           );
         })}
       </div>
    </Surface>
  );
}

function RunnerComponent() {
  const [subView, setSubView] = useState<RunnerSubView | null>(resolveInitialSubView);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (subView) {
      window.localStorage.setItem(RUNNER_SUBVIEW_STORAGE_KEY, JSON.stringify(subView));
    } else {
      window.localStorage.removeItem(RUNNER_SUBVIEW_STORAGE_KEY);
    }
  }, [subView]);

  if (subView?.view === "PartyLobbyRoom") {
    return <PartyLobbyRoom partyId={subView.payload.partyId} onBack={() => setSubView(null)} />;
  }

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

      <RunnerOpenPartiesWidget onJoinParty={(id) => setSubView({ view: "PartyLobbyRoom", payload: { partyId: id } })} />

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
