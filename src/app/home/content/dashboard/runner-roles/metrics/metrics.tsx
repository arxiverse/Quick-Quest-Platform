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
  onBack,
  children,
}: {
  title: string;
  eyebrow: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="p-5 sm:p-6 bg-base-100 border border-base-300">
        <div className="flex items-center justify-between mb-6 border-b border-base-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70 mb-1">
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

// ─── Runner — Quest Aktif ─────────────────────────────────────────────────────

export function RunnerActiveQuestDetail({ onBack }: { onBack: () => void }) {
  const weekData = [14, 18, 21, 19, 24, 22, 24];
  const max = Math.max(...weekData);
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const quests = [
    {
      title: "Bersihkan Toko",
      status: "LIVE",
      reward: "Rp150k–250k",
      distance: "0.8km",
      countdown: "13:42",
      slot: "1/1",
    },
    {
      title: "Membersihkan Kandang",
      status: "MATCH",
      reward: "Rp200k–350k",
      distance: "1.6km",
      countdown: "08:11",
      slot: "3/5",
    },
    {
      title: "Rapikan Display Warung",
      status: "IN_PROGRESS",
      reward: "Rp175k–300k",
      distance: "2.1km",
      countdown: "05:27",
      slot: "1/1",
    },
    {
      title: "Pickup Gudang Kelompok",
      status: "LIVE",
      reward: "Rp350k+",
      distance: "2.6km",
      countdown: "09:14",
      slot: "2/4",
    },
    {
      title: "Audit Display Booth",
      status: "IN_PROGRESS",
      reward: "Rp200k–300k",
      distance: "1.8km",
      countdown: "06:32",
      slot: "1/1",
    },
  ];
  const statusClass: Record<string, string> = {
    LIVE: "bg-[#DCFCE7] text-[#166534]",
    MATCH: "bg-[#DBEAFE] text-[#1D4ED8]",
    IN_PROGRESS: "bg-[#FEF3C7] text-[#92400E]",
  };
  return (
    <PageShell title="Quest Aktif" eyebrow="Runner Analytics" onBack={onBack}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Total Quest Hari Ini
              </p>
              <StatBadge
                value="24"
                hint="7 prioritas"
                toneClass="bg-[#DBEAFE]"
              />
            </div>
            <span className="text-3xl">🎯</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-base-content/50 mb-2">
              Tren Quest Aktif 7 Hari
            </p>
            <div className="flex items-end gap-1.5 h-16">
              {weekData.map((val, i) => (
                <div
                  key={days[i]}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-[4px] bg-primary/70"
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
            <div className="rounded-[8px] bg-base-200 p-2.5 text-center">
              <p className="text-[10px] text-base-content/50 font-semibold">
                Avg/Hari
              </p>
              <p className="text-sm font-bold text-base-content">20.3</p>
            </div>
            <div className="rounded-[8px] bg-base-200 p-2.5 text-center">
              <p className="text-[10px] text-base-content/50 font-semibold">
                Slot Kosong
              </p>
              <p className="text-sm font-bold text-base-content">41</p>
            </div>
            <div className="rounded-[8px] bg-base-200 p-2.5 text-center">
              <p className="text-[10px] text-base-content/50 font-semibold">
                Prioritas
              </p>
              <p className="text-sm font-bold text-base-content">7</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-base-content/50">
            Daftar Quest Aktif ({quests.length})
          </p>
          {quests.map((q) => (
            <div
              key={q.title}
              className="rounded-[10px] border border-base-300/70 bg-base-100 p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-base-content truncate">
                  {q.title}
                </p>
                <span
                  className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${statusClass[q.status]}`}
                >
                  {q.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/70">
                  {q.reward}
                </span>
                <span className="text-[10px] font-semibold bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/70">
                  {q.distance}
                </span>
                <span className="text-[10px] font-semibold bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/70">
                  Slot {q.slot}
                </span>
                <span className="text-[10px] font-semibold bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/70">
                  ⏱ {q.countdown}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Runner — Runner Online ───────────────────────────────────────────────────

export function RunnerOnlineRunnerDetail({ onBack }: { onBack: () => void }) {
  const runners = [
    {
      name: "Neira",
      status: "Standby",
      km: "0.4 km",
      score: 4.9,
      pp: "6,495",
      skill: "Retail, Bersih",
    },
    {
      name: "Raka",
      status: "On Quest",
      km: "0.8 km",
      score: 4.7,
      pp: "5,901",
      skill: "Delivery",
    },
    {
      name: "Miska",
      status: "Standby",
      km: "1.1 km",
      score: 4.8,
      pp: "6,220",
      skill: "Retail",
    },
    {
      name: "Aghnia",
      status: "Idle",
      km: "1.4 km",
      score: 4.6,
      pp: "7,014",
      skill: "Teknologi",
    },
    {
      name: "Naufal",
      status: "On Quest",
      km: "1.9 km",
      score: 4.5,
      pp: "6,410",
      skill: "Delivery",
    },
  ];
  const byStatus = {
    Standby: "#DCFCE7 text-[#166534]",
    "On Quest": "bg-[#DBEAFE] text-[#1D4ED8]",
    Idle: "bg-base-200 text-base-content/60",
  };
  return (
    <PageShell title="Runner Online" eyebrow="Runner Analytics" onBack={onBack}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Total Aktif Sekarang
              </p>
              <StatBadge value="12" hint="3 standby" toneClass="bg-[#DCFCE7]" />
            </div>
            <span className="text-3xl">🟢</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Standby", "3", "#DCFCE7"],
              ["On Quest", "7", "#DBEAFE"],
              ["Idle", "2", "bg-base-200"],
            ].map(([label, val]) => (
              <div
                key={label}
                className="rounded-[8px] bg-base-200 p-2.5 text-center"
              >
                <p className="text-[10px] text-base-content/50 font-semibold">
                  {label}
                </p>
                <p className={`text-lg font-bold text-base-content`}>{val}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[8px] border border-success/20 bg-success/5 p-3">
            <p className="text-xs font-semibold text-base-content/70">
              📍 Hot Zone Aktif
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {["Cilandak", "Kemang", "Fatmawati"].map((z) => (
                <span
                  key={z}
                  className="text-[10px] font-bold bg-error/10 text-error px-2 py-0.5 rounded-[5px]"
                >
                  {z} 🔥
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-base-content/50">
            Kandidat Terdekat ({runners.length})
          </p>
          {runners.map((r) => (
            <div
              key={r.name}
              className="rounded-[10px] border border-base-300/70 bg-base-100 p-3 flex items-center gap-3"
            >
              <div className="size-9 shrink-0 rounded-full bg-base-300 flex items-center justify-center text-sm font-bold">
                {r.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-base-content">
                    {r.name}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] bg-${byStatus[r.status as keyof typeof byStatus]}`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-[10px] text-base-content/50">
                  {r.skill} · {r.km} · ⭐ {r.score} · {r.pp} PP
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Runner — Avg Response ────────────────────────────────────────────────────

export function RunnerAvgResponseDetail({ onBack }: { onBack: () => void }) {
  const history = [
    { label: "Hari Ini", value: "14m", delta: "-3m", positive: true },
    { label: "Kemarin", value: "16m", delta: "+1m", positive: false },
    { label: "Minggu Ini", value: "15.2m", delta: "-1.8m", positive: true },
    { label: "Minggu Lalu", value: "17m", delta: "+2m", positive: false },
    { label: "Rata Bulan Ini", value: "15.5m", delta: "-0.5m", positive: true },
  ];
  const hourlyData = [22, 18, 20, 13, 11, 14, 16, 15];
  const hours = ["07", "09", "11", "13", "15", "17", "19", "21"];
  const max = Math.max(...hourlyData);
  return (
    <PageShell
      title="Avg Response Time"
      eyebrow="Runner Analytics"
      onBack={onBack}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Response Saat Ini
              </p>
              <StatBadge
                value="14m"
                hint="-3m minggu ini"
                toneClass="bg-[#FCE7F3]"
              />
            </div>
            <span className="text-3xl">⚡</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-base-content/50 mb-2">
              Response Time Per Jam (Hari Ini)
            </p>
            <div className="flex items-end gap-1 h-14">
              {hourlyData.map((val, i) => (
                <div
                  key={hours[i]}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-[3px] bg-primary/50"
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                  <span className="text-[8px] text-base-content/40">
                    {hours[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-info/20 bg-info/5 p-3">
            <p className="text-xs font-semibold text-base-content/70">
              💡 Insight
            </p>
            <p className="mt-1 text-[11px] text-base-content/60">
              Response di bawah 15m meningkatkan match rate +22%. Jam sibuk:
              07.00–11.00.
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

// ─── Runner — Open Issue ──────────────────────────────────────────────────────

export function RunnerOpenIssueDetail({ onBack }: { onBack: () => void }) {
  const issues = [
    {
      id: "#ISS-041",
      title: "Dana escrow belum keluar setelah 24 jam",
      category: "Escrow",
      severity: "HIGH",
      age: "2j",
      reporter: "Neira",
    },
    {
      id: "#ISS-039",
      title: "Runner tidak responsif setelah match",
      category: "Komunikasi",
      severity: "HIGH",
      age: "5j",
      reporter: "Miska",
    },
    {
      id: "#ISS-037",
      title: "Foto bukti kerja tidak sesuai brief",
      category: "Kualitas",
      severity: "MED",
      age: "8j",
      reporter: "Aghnia",
    },
    {
      id: "#ISS-035",
      title: "Lokasi tidak sesuai koordinat GPS",
      category: "Lokasi",
      severity: "LOW",
      age: "1h",
      reporter: "Naufal",
    },
    {
      id: "#ISS-033",
      title: "Rating tidak bisa disubmit",
      category: "Sistem",
      severity: "LOW",
      age: "1h",
      reporter: "Raka",
    },
  ];
  const sevColor: Record<string, string> = {
    HIGH: "bg-error text-error-content",
    MED: "bg-warning text-warning-content",
    LOW: "bg-base-300 text-base-content/70",
  };
  return (
    <PageShell title="Issue Open" eyebrow="Runner Analytics" onBack={onBack}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1">
                Total Terbuka
              </p>
              <StatBadge
                value="5"
                hint="2 baru hari ini"
                toneClass="bg-[#FEE2E2]"
              />
            </div>
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["HIGH", "2", "bg-error/10 text-error"],
              ["MED", "1", "bg-warning/10 text-warning"],
              ["LOW", "2", "bg-base-200 text-base-content/60"],
            ].map(([sev, count, cls]) => (
              <div
                key={sev}
                className={`rounded-[8px] p-2.5 text-center ${cls}`}
              >
                <p className="text-[10px] font-semibold">{sev}</p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[8px] border border-error/20 bg-error/5 p-3">
            <p className="text-xs font-semibold text-error">
              🚨 Perlu Tindakan Segera
            </p>
            <p className="mt-1 text-[11px] text-base-content/60">
              2 issue HIGH sudah lebih dari 2 jam tanpa respon. Eskalasi
              diperlukan.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-base-content/50">
            Semua Issue ({issues.length})
          </p>
          {issues.map((iss) => (
            <div
              key={iss.id}
              className="rounded-[10px] border border-base-300/70 bg-base-100 p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-base-content/40">
                  {iss.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-base-content/40">
                    {iss.age}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] ${sevColor[iss.severity]}`}
                  >
                    {iss.severity}
                  </span>
                </div>
              </div>
              <p className="text-xs font-semibold text-base-content">
                {iss.title}
              </p>
              <div className="flex gap-1.5">
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  {iss.category}
                </span>
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  by {iss.reporter}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Overview fallback (dipanggil dari tombol "Lihat Semua Metrics") ──────────

export function RunnerMetricsDetail({ onBack }: { onBack: () => void }) {
  return (
    <PageShell
      title="Runner Metrics Overview"
      eyebrow="Runner Analytics"
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
