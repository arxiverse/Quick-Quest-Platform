import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn, Surface } from "../../home.ui";
import {
  createInitialRunnerCountdown,
  createInitialRunnerWorkState,
  createRunnerPartySlotFill,
  formatRunnerCountdown,
  resolveInitialRunnerSubView,
  resolveRunnerActiveQuestEscrowClass,
  resolveRunnerAutoReleaseUrgency,
  resolveRunnerAvailabilityClass,
  resolveRunnerEscrowFlowIndex,
  resolveRunnerMemberStatusClass,
  resolveRunnerSkillLevelClass,
  runnerViewText,
  runnerAvailabilitySchedule,
  runnerCareerMetrics,
  runnerEarningTrajectory,
  runnerFocusInsight,
  runnerMembers,
  runnerOpenParties,
  runnerQuestEscrowFlow,
  runnerReliabilityBadges,
  runnerSkillInventory,
  runnerActiveQuests,
  syncRunnerSubViewStorage,
  tickRunnerCountdown,
  type RunnerSubView,
} from "./runner";
import { PartyLobbyRoom } from "./page/party-lobby-room";
import BorderGlow from "../../../../Animation/BorderGlow";
import { useAnimationTheme } from "../../../global.theme";

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

function RunnerActiveQuestSection() {
  const [workState, setWorkState] = useState<Record<string, "idle" | "started" | "finished">>(() =>
    createInitialRunnerWorkState(runnerActiveQuests),
  );
  const [countdown, setCountdown] = useState<Record<string, number>>(() =>
    createInitialRunnerCountdown(runnerActiveQuests),
  );

  useEffect(() => {
    const t = window.setInterval(() => {
      setCountdown((prev) => tickRunnerCountdown(prev));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  if (runnerActiveQuests.length === 0) return null;

  return (
    <Surface className="p-4 sm:p-5 border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
            {runnerViewText.activeQuest.eyebrow}
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-base-content">
            {runnerViewText.activeQuest.title}
          </h2>
        </div>
        <span className="rounded-[999px] bg-error/10 px-3 py-1 text-xs font-bold text-error ring-1 ring-error/20">
          {runnerActiveQuests.length} {runnerViewText.activeQuest.runningSuffix}
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {runnerActiveQuests.map((quest) => {
          const state = workState[quest.id];
          const secs = countdown[quest.id];
          const urgency = resolveRunnerAutoReleaseUrgency(secs);
          const escrowIndex = resolveRunnerEscrowFlowIndex(
            runnerQuestEscrowFlow,
            quest.escrowState,
          );

          return (
            <div key={quest.id} className="rounded-[12px] border border-base-300/70 bg-base-100 p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold text-base-content/55 uppercase tracking-wide">{quest.id}</p>
                  <h3 className="text-base font-bold text-base-content mt-0.5">{quest.questTitle}</h3>
                  <p className="text-xs text-base-content/60">{quest.giverName}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={cn("rounded-[8px] px-2.5 py-1 text-[11px] font-bold", resolveRunnerActiveQuestEscrowClass(quest.escrowState))}>
                    {quest.escrowState}
                  </span>
                  <span className="rounded-[8px] bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-bold text-[#166534]">
                    {quest.reward}
                  </span>
                </div>
              </div>

              {/* Escrow Step */}
              <div className="flex gap-1">
                {runnerQuestEscrowFlow.map((step, i) => (
                  <div
                    key={step}
                    className={cn(
                      "flex-1 rounded-[6px] py-1 text-center text-[9px] font-bold tracking-wide transition-colors",
                      i < escrowIndex ? "bg-[#10B981] text-white" :
                      i === escrowIndex ? "bg-primary text-primary-content" :
                      "bg-base-200 text-base-content/40",
                    )}
                  >
                    {step.replace("_", " ")}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-[9px] border border-base-300/70 bg-base-200/40 p-2">
                  <p className="text-[10px] font-semibold text-base-content/55 uppercase">
                    {runnerViewText.activeQuest.ppGainLabel}
                  </p>
                  <p className="mt-0.5 font-bold text-[#A046FF]">{quest.ppGain}</p>
                </div>
                <div className={cn("rounded-[9px] border p-2", urgency ? "border-error/40 bg-error/5" : "border-[#FDE68A] bg-[#FEF3C7]/50")}>
                  <p className={cn("text-[10px] font-semibold uppercase", urgency ? "text-error" : "text-[#92400E]")}>
                    {runnerViewText.activeQuest.autoReleaseLabel}
                  </p>
                  <p className={cn("mt-0.5 font-mono font-bold tracking-wider", urgency ? "text-error" : "text-[#92400E]")}>
                    {formatRunnerCountdown(secs)}
                  </p>
                </div>
              </div>

              <div className="rounded-[9px] border border-base-300/70 bg-base-200/40 px-3 py-2">
                <p className="text-[10px] font-semibold text-base-content/55 uppercase">
                  📍 {runnerViewText.activeQuest.locationLabel}
                </p>
                <p className="text-xs text-base-content/80 mt-0.5">{quest.locationAddress}</p>
              </div>

              {quest.status === "PENDING_CONFIRMATION" ? (
                <div className="rounded-[10px] border border-[#E9D5FF] bg-[#E9D5FF]/30 p-3 text-center">
                  <p className="text-xs font-bold text-[#6D28D9]">
                    ⏳ {runnerViewText.activeQuest.pendingAuditTitle}
                  </p>
                  <p className="text-[11px] text-[#6D28D9]/70 mt-0.5">
                    {runnerViewText.activeQuest.pendingAuditHint}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={state !== "idle"}
                    onClick={() => setWorkState((p) => ({ ...p, [quest.id]: "started" }))}
                    className="btn h-10 min-h-10 rounded-[9px] border-none bg-[#3B82F6] text-white text-xs font-bold hover:opacity-90 shadow-sm disabled:opacity-40"
                  >
                    {state === "started"
                      ? `⚡ ${runnerViewText.activeQuest.startedButtonLabel}`
                      : `▶ ${runnerViewText.activeQuest.startButtonLabel}`}
                  </button>
                  <button
                    type="button"
                    disabled={state !== "started"}
                    onClick={() => setWorkState((p) => ({ ...p, [quest.id]: "finished" }))}
                    className="btn h-10 min-h-10 rounded-[9px] border-none bg-[#10B981] text-white text-xs font-bold hover:opacity-90 shadow-sm disabled:opacity-40"
                  >
                    ✓ {runnerViewText.activeQuest.finishButtonLabel}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Surface>
  );
}

function RunnerOpenPartiesWidget({ onJoinParty }: { onJoinParty?: (id: string) => void }) {
  const { animationsEnabled } = useAnimationTheme();

  return (
    <Surface className="p-4 sm:p-5 border border-[#A046FF]/30 bg-gradient-to-br from-[#A046FF]/5 to-transparent">
       <div className="mb-2 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#A046FF] text-[12px] text-white shadow-sm shadow-[#A046FF]/40">🎉</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A046FF]">
              {runnerViewText.openParties.eyebrow}
            </p>
            <h2 className="mt-0.5 text-base font-bold text-base-content leading-tight">
              {runnerViewText.openParties.title}
            </h2>
          </div>
       </div>
       <div className="mt-3 grid gap-3 sm:grid-cols-2">
         {runnerOpenParties.map((party) => {
           const slots = createRunnerPartySlotFill(party.slotFilled, party.slotTotal);
           
           const InnerPartyCard = () => (
             <div className="p-3 w-full">
               <div className="flex items-center justify-between gap-2">
                 <div>
                   <p className="text-sm font-bold text-base-content">{party.title}</p>
                   <p className="text-[11px] font-semibold text-base-content/60">
                     {party.giver} • {runnerViewText.openParties.matchPrefix} {party.match}%
                   </p>
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
                     {party.slotFilled}/{party.slotTotal} {runnerViewText.openParties.readySuffix}
                   </div>
                 </div>
                 <button type="button" onClick={() => onJoinParty?.(party.id)} className="btn h-7 min-h-7 border-none bg-[#A046FF] px-3 py-0 text-[10px] font-bold text-white shadow hover:opacity-90">
                   {runnerViewText.openParties.joinButtonLabel}
                 </button>
               </div>
             </div>
           );

           return animationsEnabled ? (
             <BorderGlow key={party.id} className="rounded-[10px] bg-base-100 shadow-sm w-full group hover:-translate-y-0.5 transition-transform border border-[#A046FF]/10 z-0" edgeSensitivity={15} glowRadius={15} glowColor="160 70 255" glowIntensity={0.6} animated={false}>
               <div className="relative z-[1] w-full">
                  <InnerPartyCard />
               </div>
             </BorderGlow>
           ) : (
             <div key={party.id} className="rounded-[10px] border border-base-300 bg-base-100 p-0 shadow-sm hover:border-[#A046FF]/50 transition-colors">
               <InnerPartyCard />
             </div>
           );
         })}
       </div>
    </Surface>
  );
}

function RunnerComponent() {
  const [subView, setSubView] = useState<RunnerSubView | null>(
    resolveInitialRunnerSubView,
  );

  useEffect(() => {
    syncRunnerSubViewStorage(subView);
  }, [subView]);

  if (subView?.view === "PartyLobbyRoom") {
    return <PartyLobbyRoom partyId={subView.payload.partyId} onBack={() => setSubView(null)} />;
  }

  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">
              {runnerViewText.hero.eyebrow}
            </p>
            <h1 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">
              {runnerViewText.hero.title}
            </h1>
          </div>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">
            {runnerViewText.hero.simulationBadge}
          </span>
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

      <RunnerActiveQuestSection />

      <RunnerOpenPartiesWidget onJoinParty={(id) => setSubView({ view: "PartyLobbyRoom", payload: { partyId: id } })} />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {runnerViewText.skillInventory.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {runnerViewText.skillInventory.title}
          </h2>
          <div className="mt-3 space-y-2.5">
            {runnerSkillInventory.map((skill) => (
              <div key={skill.skill} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{skill.skill}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", resolveRunnerSkillLevelClass(skill.level))}>{skill.level}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/65">
                  <span>{skill.pp}</span>
                  <span>|</span>
                  <span>{runnerViewText.skillInventory.completionPrefix} {skill.completionRate}</span>
                  <span>|</span>
                  <span>{runnerViewText.skillInventory.trendPrefix} {skill.trend}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">{runnerFocusInsight.title}</p>
            <p className="mt-1 text-sm font-medium text-base-content/80">{runnerFocusInsight.description}</p>
            <p className="mt-1.5 text-xs font-semibold text-base-content/60">
              {runnerViewText.skillInventory.focusWindowPrefix} {runnerFocusInsight.demandWindow}
            </p>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {runnerViewText.availability.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {runnerViewText.availability.title}
          </h2>
          <div className="mt-3 space-y-2">
            {runnerAvailabilitySchedule.map((slot) => (
              <div key={slot.day} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{slot.day}</p>
                  <span className="text-xs text-base-content/60">
                    {runnerViewText.availability.slotsLabel}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={cn("rounded-[8px] px-2 py-1 text-[11px] font-semibold", resolveRunnerAvailabilityClass(slot.morning))}>
                    {runnerViewText.availability.morningPrefix} {slot.morning}
                  </span>
                  <span className={cn("rounded-[8px] px-2 py-1 text-[11px] font-semibold", resolveRunnerAvailabilityClass(slot.afternoon))}>
                    {runnerViewText.availability.afternoonPrefix} {slot.afternoon}
                  </span>
                  <span className={cn("rounded-[8px] px-2 py-1 text-[11px] font-semibold", resolveRunnerAvailabilityClass(slot.night))}>
                    {runnerViewText.availability.nightPrefix} {slot.night}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {runnerViewText.earning.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {runnerViewText.earning.title}
          </h2>
          <div className="mt-4 h-[300px] min-h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={runnerEarningTrajectory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line type="monotone" dataKey="income" name={runnerViewText.earning.incomeLegend} stroke="#A046FF" strokeWidth={3} dot={{ r: 4, fill: "#A046FF" }} />
                <Line type="monotone" dataKey="quests" name={runnerViewText.earning.completedQuestLegend} stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8" }} />
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
                <Bar dataKey="income" name={runnerViewText.earning.incomeBarLegend} fill="#6B21FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {runnerViewText.reliability.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {runnerViewText.reliability.title}
          </h2>
          <div className="mt-3 space-y-2.5">
            {runnerReliabilityBadges.map((badge) => (
              <div key={badge.name} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{badge.name}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", badge.tone)}>
                    {runnerViewText.reliability.activeLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{badge.description}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
          {runnerViewText.roster.eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-bold text-base-content">
          {runnerViewText.roster.title}
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {runnerMembers.map((member) => (
            <div key={member.name} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-base-content">{member.name}</p>
                <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", resolveRunnerMemberStatusClass(member.currentStatus))}>{member.currentStatus}</span>
              </div>
              <p className="text-xs text-base-content/65">{member.primarySkill}</p>
              <p className="mt-1 text-xs text-base-content/65">
                {runnerViewText.roster.areaPrefix} {member.location}
              </p>
              <p className="mt-1 text-xs font-semibold text-base-content/70">
                {runnerViewText.roster.reliabilityPrefix} {member.reliabilityScore}
              </p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

export default RunnerComponent;
