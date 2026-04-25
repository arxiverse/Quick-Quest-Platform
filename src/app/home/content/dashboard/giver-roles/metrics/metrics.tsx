import { Surface } from "../../../../home.ui";

// ─── Shared helper ────────────────────────────────────────────────────────────

function StatBadge({
  value,
  hint,
  toneClass,
}: {
  value: string;
  hint: string;
  toneClass: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-2xl font-bold text-base-content">{value}</p>
      <span
        className={`self-start inline-flex rounded-[8px] px-2.5 py-0.5 text-[11px] font-semibold text-black ${toneClass}`}
      >
        {hint}
      </span>
    </div>
  );
}

function PageShell({
  title,
  eyebrow,
  eyebrowColor = "text-warning/70",
  onBack,
  children,
}: {
  title: string;
  eyebrow: string;
  eyebrowColor?: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="p-5 sm:p-6 bg-base-100 border border-base-300">
        <div className="flex items-center justify-between mb-6 border-b border-base-200 pb-4">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.16em] mb-1 ${eyebrowColor}`}
            >
              {eyebrow}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="btn h-10 min-h-10 px-5 cursor-pointer rounded-[8px] bg-base-200 text-base-content/70 border-none hover:bg-base-300 shadow-none transition-transform active:scale-95"
          >
            Kembali
          </button>
        </div>
        {children}
      </Surface>
    </div>
  );
}

// ─── Giver — Quest Dibroadcast ────────────────────────────────────────────────

export function GiverBroadcastQuestDetail({ onBack }: { onBack: () => void }) {
  const weekData = [18, 21, 25, 23, 27, 24, 27];
  const max = Math.max(...weekData);
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const broadcasts = [
    {
      title: "Restock Minimarket Pagi",
      viewers: 12,
      claims: 3,
      status: "LIVE",
      slot: "0/1",
    },
    {
      title: "Pickup Gudang Kelompok",
      viewers: 18,
      claims: 6,
      status: "MATCH",
      slot: "2/4",
    },
    {
      title: "Audit Display Booth Event",
      viewers: 8,
      claims: 2,
      status: "IN_PROGRESS",
      slot: "1/1",
    },
    {
      title: "Bersih Gudang Sore",
      viewers: 5,
      claims: 1,
      status: "LIVE",
      slot: "0/2",
    },
  ];
  const statusClass: Record<string, string> = {
    LIVE: "bg-[#DCFCE7] text-[#166534]",
    MATCH: "bg-[#DBEAFE] text-[#1D4ED8]",
    IN_PROGRESS: "bg-[#FEF3C7] text-[#92400E]",
  };
  return (
    <PageShell
      title="Quest Dibroadcast"
      eyebrow="Giver Analytics"
      onBack={onBack}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Total Broadcast Hari Ini
              </p>
              <StatBadge
                value="19"
                hint="6 butuh slot"
                toneClass="bg-[#DBEAFE]"
              />
            </div>
            <span className="text-3xl">📡</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-base-content/50 mb-2">
              Tren Broadcast 7 Hari
            </p>
            <div className="flex items-end gap-1.5 h-14">
              {weekData.map((val, i) => (
                <div
                  key={days[i]}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-[4px] bg-warning/70"
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                  <span className="text-[9px] text-base-content/40">
                    {days[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-base-300/50">
            {[
              ["Avg/Hari", "23.6"],
              ["Masih Aktif", "11"],
              ["Slot Kosong", "15"],
            ].map(([label, val]) => (
              <div
                key={label}
                className="rounded-[8px] bg-base-200 p-2.5 text-center"
              >
                <p className="text-[10px] text-base-content/50 font-semibold">
                  {label}
                </p>
                <p className="text-sm font-bold text-base-content">{val}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-base-content/50">
            Broadcast Aktif ({broadcasts.length})
          </p>
          {broadcasts.map((b) => (
            <div
              key={b.title}
              className="rounded-[10px] border border-base-300/70 bg-base-100 p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-base-content truncate">
                  {b.title}
                </p>
                <span
                  className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${statusClass[b.status]}`}
                >
                  {b.status}
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  👁 {b.viewers}
                </span>
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  📥 {b.claims} klaim
                </span>
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  Slot {b.slot}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Giver — Fill Rate ────────────────────────────────────────────────────────

export function GiverFillRateDetail({ onBack }: { onBack: () => void }) {
  const funnelSteps = [
    { label: "Broadcast Tayang", value: 27, pct: 100, color: "bg-primary" },
    { label: "Dilihat Runner", value: 19, pct: 70, color: "bg-info" },
    { label: "Diklaim", value: 14, pct: 52, color: "bg-success" },
    { label: "Slot Penuh", value: 11, pct: 41, color: "bg-warning" },
    { label: "Selesai", value: 9, pct: 33, color: "bg-secondary" },
  ];
  const weekFill = [68, 72, 75, 71, 81, 77, 81];
  const max = Math.max(...weekFill);
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  return (
    <PageShell title="Fill Rate" eyebrow="Giver Analytics" onBack={onBack}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Fill Rate Hari Ini
              </p>
              <StatBadge
                value="81%"
                hint="+4% minggu ini"
                toneClass="bg-[#DCFCE7]"
              />
            </div>
            <span className="text-3xl">🔄</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-base-content/50 mb-2">
              Tren Fill Rate % 7 Hari
            </p>
            <div className="flex items-end gap-1.5 h-14">
              {weekFill.map((val, i) => (
                <div
                  key={days[i]}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-[4px] bg-success/60"
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                  <span className="text-[9px] text-base-content/40">
                    {days[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-success/20 bg-success/5 p-3">
            <p className="text-xs font-semibold text-base-content/70">
              💡 Rekomendasi
            </p>
            <p className="mt-1 text-[11px] text-base-content/60">
              Brief dengan foto + reward jelas meningkatkan fill rate +18%.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold text-base-content/50">
            Conversion Funnel Hari Ini
          </p>
          {funnelSteps.map((step) => (
            <div key={step.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-base-content/70">
                  {step.label}
                </span>
                <span className="text-xs font-bold text-base-content">
                  {step.value}{" "}
                  <span className="text-[10px] text-base-content/40">
                    ({step.pct}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-base-200">
                <div
                  className={`h-2 rounded-full ${step.color} opacity-70`}
                  style={{ width: `${step.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Giver — Avg Match Time ───────────────────────────────────────────────────

export function GiverMatchAvgDetail({ onBack }: { onBack: () => void }) {
  const history = [
    { label: "Hari Ini", value: "10m", delta: "-2m", positive: true },
    { label: "Kemarin", value: "11m", delta: "+1m", positive: false },
    { label: "Minggu Ini", value: "10.5m", delta: "-1.5m", positive: true },
    { label: "Minggu Lalu", value: "12m", delta: "+2m", positive: false },
    { label: "Rata Bulan Ini", value: "11.2m", delta: "-0.8m", positive: true },
  ];
  const hourlyData = [18, 14, 12, 10, 9, 11, 13, 15];
  const hours = ["07", "09", "11", "13", "15", "17", "19", "21"];
  const max = Math.max(...hourlyData);
  return (
    <PageShell title="Avg Match Time" eyebrow="Giver Analytics" onBack={onBack}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Match Time Sekarang
              </p>
              <StatBadge
                value="10m"
                hint="-2m dari target"
                toneClass="bg-[#FCE7F3]"
              />
            </div>
            <span className="text-3xl">⏱️</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-base-content/50 mb-2">
              Match Time Per Jam (Hari Ini, menit)
            </p>
            <div className="flex items-end gap-1 h-14">
              {hourlyData.map((val, i) => (
                <div
                  key={hours[i]}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-[3px] bg-warning/60"
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                  <span className="text-[8px] text-base-content/40">
                    {hours[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-success/20 bg-success/5 p-3">
            <p className="text-xs font-semibold text-base-content/70">
              💡 Insight
            </p>
            <p className="mt-1 text-[11px] text-base-content/60">
              Brief yang dilengkapi foto lokasi mempersingkat match time
              rata-rata 30%.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-base-content/50">
            Histori Perbandingan
          </p>
          {history.map((h) => (
            <div
              key={h.label}
              className="flex items-center justify-between rounded-[8px] bg-base-200 px-3 py-2.5"
            >
              <p className="text-xs font-semibold text-base-content/70">
                {h.label}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-base-content">{h.value}</p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${h.positive ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}
                >
                  {h.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Giver — Escrow Locked ────────────────────────────────────────────────────

export function GiverEscrowLockedDetail({ onBack }: { onBack: () => void }) {
  const locks = [
    {
      quest: "Restock Minimarket Pagi",
      amount: "Rp420.000",
      state: "LOCKED",
      eta: "12m",
    },
    {
      quest: "Pickup Gudang Kelompok",
      amount: "Rp1.260.000",
      state: "IN_PROGRESS",
      eta: "08m",
    },
    {
      quest: "Audit Display Booth Event",
      amount: "Rp280.000",
      state: "PENDING_CONFIRMATION",
      eta: "05m",
    },
    {
      quest: "Bersih Gudang Sore",
      amount: "Rp350.000",
      state: "LOCKED",
      eta: "18m",
    },
    {
      quest: "Cek Inventori Toko",
      amount: "Rp190.000",
      state: "IN_PROGRESS",
      eta: "11m",
    },
  ];
  const stateClass: Record<string, string> = {
    LOCKED: "bg-[#DBEAFE] text-[#1D4ED8]",
    IN_PROGRESS: "bg-[#FEF3C7] text-[#92400E]",
    PENDING_CONFIRMATION: "bg-[#FCE7F3] text-[#9D174D]",
  };

  // const totalLocked = locks.reduce(
  //   (acc, l) => acc + parseInt(l.amount.replace(/[^0-9]/g, "")),
  //   0,
  // );

  return (
    <PageShell title="Escrow Locked" eyebrow="Giver Analytics" onBack={onBack}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Total Dana Terkunci
              </p>
              <StatBadge
                value="Rp3.1jt"
                hint="17 quest aktif"
                toneClass="bg-[#FEF3C7]"
              />
            </div>
            <span className="text-3xl">🔐</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Locked", "8", "bg-[#DBEAFE]"],
              ["In Progress", "6", "bg-[#FEF3C7]"],
              ["Pending", "3", "bg-[#FCE7F3]"],
            ].map(([label, val, cls]) => (
              <div
                key={label}
                className={`rounded-[8px] p-2.5 text-center ${cls}`}
              >
                <p className="text-[9px] font-semibold text-base-content/60">
                  {label}
                </p>
                <p className="text-lg font-bold text-base-content">{val}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[8px] border border-warning/20 bg-warning/5 p-3">
            <p className="text-xs font-semibold text-base-content/70">
              💡 Cashflow Info
            </p>
            <p className="mt-1 text-[11px] text-base-content/60">
              Dana escrow akan direlease otomatis setelah konfirmasi selesai.
              Avg release time: 4 jam.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-base-content/50">
            Detail Lock Aktif ({locks.length})
          </p>
          {locks.map((item) => (
            <div
              key={item.quest}
              className="rounded-[10px] border border-base-300/70 bg-base-100 p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-base-content truncate">
                  {item.quest}
                </p>
                <span
                  className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] ${stateClass[item.state]}`}
                >
                  {item.state}
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content font-semibold">
                  {item.amount}
                </span>
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  ETA {item.eta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Overview fallback ────────────────────────────────────────────────────────

export function GiverMetricsDetail({ onBack }: { onBack: () => void }) {
  return (
    <PageShell
      title="Giver Metrics Overview"
      eyebrow="Giver Analytics"
      onBack={onBack}
    >
      <div className="min-h-[200px] flex items-center justify-center rounded-[12px] bg-base-200/50 border-2 border-dashed border-base-300 p-6 text-center">
        <p className="text-sm text-base-content/60">
          Pilih metrik spesifik dari dashboard untuk melihat detail mendalam.
        </p>
      </div>
    </PageShell>
  );
}
