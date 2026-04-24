import type {
  DashboardActivityItem,
  DashboardCarouselItem,
  DashboardFilterKey,
  DashboardGeoScopeItem,
  DashboardLeaderboardScope,
  DashboardKpiItem,
  DashboardImpactCounterItem,
  DashboardLeaderboardGroup,
  DashboardQuickFilterMenu,
  DashboardQuestItem,
  DashboardSnapshotItem,
  DashboardStatusHelpItem,
} from "./dashboard";

export const DASHBOARD_FILTER_STORAGE_KEY_SEED =
  "nvrs-qqm-dashboard-live-filters-v1";
export const DASHBOARD_SUBVIEW_STORAGE_KEY_SEED =
  "nvrs-qqm-dashboard-subview-v1";

export const dashboardEscrowFlowSeed: DashboardQuestItem["escrowState"][] = [
  "UNPAID",
  "LOCKED",
  "IN_PROGRESS",
  "PENDING_CONFIRMATION",
  "RELEASED",
];

export const dashboardLeaderboardScopesSeed: DashboardLeaderboardScope[] = [
  "Lokal",
  "Provinsi",
  "Nasional",
];

export type DashboardViewCopy = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  mode: {
    runnerLabel: string;
    giverLabel: string;
    giverLockedHint: string;
    giverWarning: string;
  };
  radar: {
    title: string;
    radiusPrefix: string;
    legendTargetLocation: string;
    legendTopRunner: string;
    legendBackupRunner: string;
    candidateLabel: string;
    candidateHint: string;
    runnerStatusLabel: string;
    runnerStatusHint: string;
  };
  questCard: {
    escrowStateLabel: string;
    slotPrefix: string;
    questTypePrefix: string;
    slotFilledPrefix: string;
    trustVerifiedGiverLabel: string;
    trustVerifiedValue: string;
    trustUnverifiedValue: string;
    trustCompletionLabel: string;
    trustDisputeRatioLabel: string;
    ppFormulaLabel: string;
    ppFormulaTooltip: string;
    deltaPrefix: string;
    detailButtonLabel: string;
  };
  impact: {
    eyebrow: string;
    title: string;
  };
  leaderboard: {
    eyebrow: string;
    title: string;
  };
  snapshot: {
    eyebrow: string;
    title: string;
    detailButtonLabel: string;
  };
  carousel: {
    itemEyebrow: string;
  };
  activity: {
    eyebrow: string;
    title: string;
  };
  liveQuest: {
    title: string;
    emptyTitle: string;
    emptyHint: string;
    expandRadiusButton: string;
    completeSkillButton: string;
    lowVolumeEyebrow: string;
    lowVolumeHint: string;
    filterRotateButtonTitlePrefix: string;
  };
};

export const dashboardViewCopySeed: DashboardViewCopy = {
  hero: {
    eyebrow: "Quick Quest Model",
    title: "Kompetisi Kontribusi Nyata, Bukan Sekadar Aktivitas",
    description:
      "QQM mengubah pola tolong-menolong jadi pasar micro-task yang aman, cepat, dan merit-based lewat status live, trust score, dan progress yang transparan.",
  },
  mode: {
    runnerLabel: "Mode Runner",
    giverLabel: "Mode Giver",
    giverLockedHint: "Giver mode terkunci sampai verifikasi identitas aktif.",
    giverWarning:
      "Kamu tidak bisa menerima pekerjaan yang kamu berikan sendiri. Quest harus diambil oleh Runner lain.",
  },
  radar: {
    title: "Live Sonar Mapping",
    radiusPrefix: "Radius Aktif",
    legendTargetLocation: "Target Lokasi (Giver)",
    legendTopRunner: "Top Runner (1km)",
    legendBackupRunner: "Backup Runner (2km)",
    candidateLabel: "Estimasi Kandidat",
    candidateHint: "Runner valid siap meluncur",
    runnerStatusLabel: "Runner Status",
    runnerStatusHint: "Aktif dalam radius ini",
  },
  questCard: {
    escrowStateLabel: "Escrow State",
    slotPrefix: "Slot",
    questTypePrefix: "Tipe Quest",
    slotFilledPrefix: "Slot terisi",
    trustVerifiedGiverLabel: "Verified Giver",
    trustVerifiedValue: "Verified",
    trustUnverifiedValue: "Unverified",
    trustCompletionLabel: "Completion",
    trustDisputeRatioLabel: "Dispute Ratio",
    ppFormulaLabel: "Rumus PP",
    ppFormulaTooltip: "PP = (Rating x Difficulty x Value) x TimeDecay",
    deltaPrefix: "Delta",
    detailButtonLabel: "Detail",
  },
  impact: {
    eyebrow: "Impact Counter",
    title: "Dampak Ekosistem Mingguan",
  },
  leaderboard: {
    eyebrow: "Leaderboard",
    title: "Scope Rank",
  },
  snapshot: {
    eyebrow: "Today Snapshot",
    title: "Ringkasan Performa Hari Ini",
    detailButtonLabel: "Lihat Detail",
  },
  carousel: {
    itemEyebrow: "Carousel",
  },
  activity: {
    eyebrow: "Recent Activity",
    title: "Aktivitas Terbaru",
  },
  liveQuest: {
    title: "Sedang Berlangsung",
    emptyTitle: "Belum ada quest yang cocok untuk filter sekarang.",
    emptyHint: "Coba rekomendasi ini dulu untuk memperluas peluang match.",
    expandRadiusButton: "Perluas Radius",
    completeSkillButton: "Lengkapi Skill",
    lowVolumeEyebrow: "Low Volume Suggestion",
    lowVolumeHint:
      "Data quest masih tipis. Rekomendasi: perluas radius 1-2 km atau tambahkan skill baru agar feed lebih ramai.",
    filterRotateButtonTitlePrefix: "Klik untuk ganti filter",
  },
};

export const dashboardCarouselItems: DashboardCarouselItem[] = [
  {
    title: "Quest UMKM Terdekat",
    subtitle: "Temukan bantuan harian dengan reward terbaik di sekitarmu.",
    accent: "bg-base-300/80",
  },
  {
    title: "Weekly Highlight",
    subtitle: "Tugas cepat dengan rating stabil dan proses yang jelas.",
    accent: "bg-base-300/80",
  },
  {
    title: "Top Performer",
    subtitle: "Quest prioritas dengan poin tinggi untuk minggu ini.",
    accent: "bg-base-300/80",
  },
];

export const dashboardKpiItems: DashboardKpiItem[] = [
  {
    label: "Quest Aktif",
    value: "24",
    hint: "7 prioritas",
    tone: "bg-[#DBEAFE]",
  },
  {
    label: "Runner Online",
    value: "12",
    hint: "3 standby",
    tone: "bg-[#DCFCE7]",
  },
  {
    label: "Avg Response",
    value: "14m",
    hint: "-3m minggu ini",
    tone: "bg-[#FCE7F3]",
  },
  {
    label: "Issue Open",
    value: "5",
    hint: "2 baru hari ini",
    tone: "bg-[#FEE2E2]",
  },
];

export const liveQuestItems: DashboardQuestItem[] = [
  {
    title: "Bersihkan Toko",
    owner: "Neira",
    role: "Pedagang",
    status: "LIVE",
    escrowState: "LOCKED",
    mode: "Per-Individu",
    skill: "Kebersihan",
    wageBand: "100K-200K",
    skillMatchScore: 91,
    slotFilled: 1,
    slotTotal: 1,
    ppDelta: "+18.4",
    verifiedGiver: true,
    completionRate: "96%",
    disputeRatio: "0.8%",
    distanceKm: 0.8,
    countdown: "13:42",
    slots: "1 / 1",
    category: "Bersih - Bersih, Tukang",
    points: "+ 125 pp",
    reward: "Rp. 150.000 - Rp.250.000",
    score: "2.68",
  },
  {
    title: "Membersihkan Kandang Ayam",
    owner: "Neira",
    role: "Pedagang",
    status: "MATCH",
    escrowState: "PENDING_CONFIRMATION",
    mode: "Ber-Kelompok",
    skill: "Kebersihan",
    wageBand: "200K-350K",
    skillMatchScore: 84,
    slotFilled: 3,
    slotTotal: 5,
    ppDelta: "+24.7",
    verifiedGiver: true,
    completionRate: "92%",
    disputeRatio: "1.1%",
    distanceKm: 1.6,
    countdown: "08:11",
    slots: "3 / 5",
    category: "Bersih - Bersih, Cleaning Service",
    points: "+ 245 pp",
    reward: "Rp. 200.000 - Rp.350.000",
    score: "2.97",
  },
  {
    title: "Rapikan Display Warung",
    owner: "Miska",
    role: "Pemilik Usaha",
    status: "IN_PROGRESS",
    escrowState: "IN_PROGRESS",
    mode: "Per-Individu",
    skill: "Retail",
    wageBand: "200K-350K",
    skillMatchScore: 77,
    slotFilled: 1,
    slotTotal: 1,
    ppDelta: "+12.1",
    verifiedGiver: false,
    completionRate: "88%",
    disputeRatio: "2.4%",
    distanceKm: 2.1,
    countdown: "05:27",
    slots: "1 / 1",
    category: "Retail, Kebersihan, Visual",
    points: "+ 180 pp",
    reward: "Rp. 175.000 - Rp.300.000",
    score: "4.12",
  },
];

export const dashboardQuickFilterMenus: DashboardQuickFilterMenu[] = [
  {
    key: "status" as DashboardFilterKey,
    label: "Status",
    options: [
      { value: "ALL", label: "Semua" },
      { value: "LIVE", label: "LIVE" },
      { value: "MATCH", label: "MATCH" },
      { value: "IN_PROGRESS", label: "IN_PROGRESS" },
    ],
  },
  {
    key: "radius" as DashboardFilterKey,
    label: "Radius",
    options: [
      { value: "ALL", label: "Semua Jarak" },
      { value: "LT_2", label: "< 2 km" },
      { value: "GTE_2", label: ">= 2 km" },
    ],
  },
  {
    key: "upah" as DashboardFilterKey,
    label: "Upah",
    options: [
      { value: "ALL", label: "Semua Upah" },
      { value: "100K-200K", label: "100K-200K" },
      { value: "200K-350K", label: "200K-350K" },
      { value: "350K+", label: "350K+" },
    ],
  },
  {
    key: "skill" as DashboardFilterKey,
    label: "Skill",
    options: [
      { value: "ALL", label: "Semua Skill" },
      { value: "Kebersihan", label: "Kebersihan" },
      { value: "Retail", label: "Retail" },
      { value: "Delivery", label: "Delivery" },
      { value: "Teknologi", label: "Teknologi" },
    ],
  },
  {
    key: "mode" as DashboardFilterKey,
    label: "Mode",
    options: [
      { value: "ALL", label: "Semua Mode" },
      { value: "Per-Individu", label: "Per-Individu" },
      { value: "Ber-Kelompok", label: "Ber-Kelompok" },
    ],
  },
];

export const dashboardSnapshotItems: DashboardSnapshotItem[] = [
  { label: "Live Quest Hari Ini", value: "41", hint: "+8 dari kemarin", toneClass: "bg-[#DBEAFE]" },
  { label: "Match Rate", value: "78%", hint: "Target 80%", toneClass: "bg-[#DCFCE7]" },
  { label: "Avg Time to Match", value: "12m", hint: "-2m minggu ini", toneClass: "bg-[#FCE7F3]" },
  { label: "Escrow Released", value: "Rp2.4jt", hint: "24 transaksi", toneClass: "bg-[#FEF3C7]" },
];

export const dashboardActivityItems: DashboardActivityItem[] = [
  {
    title: "Quest berhasil di-claim",
    detail: "Neira mengambil quest Bersihkan Toko (0.8 km)",
    time: "2 menit lalu",
    toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    title: "Escrow released",
    detail: "Pembayaran quest Display Warung sudah dirilis ke runner",
    time: "11 menit lalu",
    toneClass: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    title: "Rating masuk",
    detail: "Quest Giver memberi rating 4.8 untuk quest Display Warung",
    time: "27 menit lalu",
    toneClass: "bg-[#FCE7F3] text-[#9D174D]",
  },
];

export const dashboardStatusHelpItems: DashboardStatusHelpItem[] = [
  { status: "LIVE", description: "Quest baru dibuka dan masih menerima klaim." },
  { status: "MATCH", description: "Sudah ada kandidat runner, menunggu konfirmasi akhir." },
  { status: "IN_PROGRESS", description: "Quest sedang dikerjakan sampai tahap konfirmasi." },
];

export const dashboardImpactCounterItems: DashboardImpactCounterItem[] = [
  { label: "Runner Terbantu Minggu Ini", value: "128", hint: "7 hari terakhir", toneClass: "bg-[#DBEAFE]" },
  { label: "Total Upah Tersalurkan", value: "Rp18.6jt", hint: "fee platform 6.2%", toneClass: "bg-[#DCFCE7]" },
  { label: "Quest Selesai", value: "342", hint: "92% selesai tepat waktu", toneClass: "bg-[#FEF3C7]" },
];

export const dashboardLeaderboardGroups: DashboardLeaderboardGroup[] = [
  {
    scope: "Lokal",
    items: [
      { rank: 1, name: "Neira", pp: "6,495", trend: "+128" },
      { rank: 2, name: "Miska", pp: "6,220", trend: "+94" },
      { rank: 3, name: "Raka", pp: "5,901", trend: "+76" },
    ],
  },
  {
    scope: "Provinsi",
    items: [
      { rank: 1, name: "Aghnia", pp: "8,112", trend: "+144" },
      { rank: 2, name: "Neira", pp: "6,495", trend: "+128" },
      { rank: 3, name: "Naufal", pp: "6,410", trend: "+109" },
    ],
  },
  {
    scope: "Nasional",
    items: [
      { rank: 1, name: "Rizki", pp: "12,224", trend: "+201" },
      { rank: 2, name: "Aghnia", pp: "8,112", trend: "+144" },
      { rank: 3, name: "Neira", pp: "6,495", trend: "+128" },
    ],
  },
];

export const dashboardGeoScopeItems: DashboardGeoScopeItem[] = [
  {
    radiusValue: "ALL",
    radiusLabel: "Semua Radius",
    estimatedRunners: "56 runner",
    activeRunners: "34 online",
    avgEta: "ETA 16m",
    hotZones: ["Cilandak", "Pasar Minggu", "Cipete"],
  },
  {
    radiusValue: "LT_2",
    radiusLabel: "< 2 km",
    estimatedRunners: "21 runner",
    activeRunners: "15 online",
    avgEta: "ETA 9m",
    hotZones: ["Cilandak", "Fatmawati", "Kemang"],
  },
  {
    radiusValue: "GTE_2",
    radiusLabel: ">= 2 km",
    estimatedRunners: "35 runner",
    activeRunners: "19 online",
    avgEta: "ETA 19m",
    hotZones: ["Tebet", "Pancoran", "Kuningan"],
  },
];

export const dashboardGiverViewCopySeed: DashboardViewCopy = {
  ...dashboardViewCopySeed,
  hero: {
    eyebrow: "Giver Command Snapshot",
    title: "Kontrol Broadcast, Kandidat, dan Escrow Dalam Satu Dashboard",
    description:
      "Mode giver fokus ke kualitas brief, kecepatan match runner, dan kestabilan release escrow supaya quest selesai tanpa friction.",
  },
  radar: {
    ...dashboardViewCopySeed.radar,
    legendTargetLocation: "Titik Broadcast (Giver)",
    candidateHint: "Kandidat runner terdeteksi",
    runnerStatusHint: "Siap menerima broadcast",
  },
  impact: {
    eyebrow: "Broadcast Impact",
    title: "Performa Quest yang Kamu Berikan",
  },
  snapshot: {
    eyebrow: "Giver Snapshot",
    title: "Ringkasan Operasional Quest Hari Ini",
    detailButtonLabel: "Buka Laporan",
  },
  activity: {
    eyebrow: "Giver Activity",
    title: "Aktivitas Broadcast Terbaru",
  },
  liveQuest: {
    ...dashboardViewCopySeed.liveQuest,
    title: "Quest Broadcast",
    emptyTitle: "Belum ada broadcast yang sesuai filter saat ini.",
    emptyHint: "Coba longgarkan filter radius atau mode untuk melihat broadcast lain.",
    expandRadiusButton: "Expand Radius",
    completeSkillButton: "Perbaiki Brief",
  },
};

export const dashboardGiverCarouselItemsSeed: DashboardCarouselItem[] = [
  {
    title: "Broadcast Prioritas",
    subtitle: "Pantau quest dengan peluang match tertinggi dalam 30 menit.",
    accent: "bg-base-300/80",
  },
  {
    title: "Escrow Watch",
    subtitle: "Kontrol lock-release supaya cashflow tetap aman dan cepat.",
    accent: "bg-base-300/80",
  },
  {
    title: "Quality Brief",
    subtitle: "Kelengkapan brief memotong dispute sebelum quest dimulai.",
    accent: "bg-base-300/80",
  },
];

export const dashboardGiverKpiItemsSeed: DashboardKpiItem[] = [
  { label: "Quest Dibroadcast", value: "19", hint: "6 butuh slot tambahan", tone: "bg-[#DBEAFE]" },
  { label: "Fill Rate", value: "81%", hint: "+4% minggu ini", tone: "bg-[#DCFCE7]" },
  { label: "Avg Match", value: "10m", hint: "-2m dari target", tone: "bg-[#FCE7F3]" },
  { label: "Escrow Locked", value: "Rp3.1jt", hint: "17 quest aktif", tone: "bg-[#FEF3C7]" },
];

export const dashboardGiverQuestItemsSeed: DashboardQuestItem[] = [
  {
    title: "Restock Minimarket Pagi",
    owner: "Aghnia",
    role: "Giver Retail",
    status: "LIVE",
    escrowState: "LOCKED",
    mode: "Per-Individu",
    skill: "Retail",
    wageBand: "200K-350K",
    skillMatchScore: 89,
    slotFilled: 0,
    slotTotal: 1,
    ppDelta: "+15.1",
    verifiedGiver: true,
    completionRate: "97%",
    disputeRatio: "0.7%",
    distanceKm: 1.1,
    countdown: "12:40",
    slots: "0 / 1",
    category: "Retail, Merchandising",
    points: "+ 140 pp",
    reward: "Rp. 220.000 - Rp.320.000",
    score: "3.21",
  },
  {
    title: "Pickup Gudang Kelompok",
    owner: "Naufal",
    role: "Giver Logistik",
    status: "MATCH",
    escrowState: "PENDING_CONFIRMATION",
    mode: "Ber-Kelompok",
    skill: "Delivery",
    wageBand: "350K+",
    skillMatchScore: 86,
    slotFilled: 2,
    slotTotal: 4,
    ppDelta: "+28.2",
    verifiedGiver: true,
    completionRate: "94%",
    disputeRatio: "1.0%",
    distanceKm: 2.6,
    countdown: "09:14",
    slots: "2 / 4",
    category: "Logistik, Delivery, Angkut",
    points: "+ 260 pp",
    reward: "Rp. 360.000 - Rp.540.000",
    score: "2.88",
  },
  {
    title: "Audit Display Booth Event",
    owner: "Miska",
    role: "Giver Event",
    status: "IN_PROGRESS",
    escrowState: "IN_PROGRESS",
    mode: "Per-Individu",
    skill: "Retail",
    wageBand: "200K-350K",
    skillMatchScore: 81,
    slotFilled: 1,
    slotTotal: 1,
    ppDelta: "+11.6",
    verifiedGiver: true,
    completionRate: "91%",
    disputeRatio: "1.6%",
    distanceKm: 1.8,
    countdown: "06:32",
    slots: "1 / 1",
    category: "Retail, Event Support",
    points: "+ 190 pp",
    reward: "Rp. 200.000 - Rp.300.000",
    score: "3.76",
  },
];

export const dashboardGiverSnapshotItemsSeed: DashboardSnapshotItem[] = [
  { label: "Broadcast Hari Ini", value: "27", hint: "+5 dari kemarin", toneClass: "bg-[#DBEAFE]" },
  { label: "Conversion", value: "73%", hint: "target 75%", toneClass: "bg-[#DCFCE7]" },
  { label: "Avg Fill Time", value: "11m", hint: "-1m minggu ini", toneClass: "bg-[#FCE7F3]" },
  { label: "Escrow Lock", value: "Rp3.1jt", hint: "17 transaksi", toneClass: "bg-[#FEF3C7]" },
];

export const dashboardGiverActivityItemsSeed: DashboardActivityItem[] = [
  {
    title: "Broadcast dipublikasikan",
    detail: "Quest Restock Minimarket Pagi tayang ke radius 1 km",
    time: "1 menit lalu",
    toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    title: "Runner match masuk",
    detail: "2 kandidat cocok untuk quest Pickup Gudang Kelompok",
    time: "9 menit lalu",
    toneClass: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    title: "Escrow status update",
    detail: "Quest Audit Display Booth Event masuk tahap IN_PROGRESS",
    time: "21 menit lalu",
    toneClass: "bg-[#FCE7F3] text-[#9D174D]",
  },
];

export const dashboardGiverStatusHelpItemsSeed: DashboardStatusHelpItem[] = [
  { status: "LIVE", description: "Broadcast aktif dan menunggu kandidat runner." },
  { status: "MATCH", description: "Kandidat runner sudah cocok, menunggu finalisasi slot." },
  { status: "IN_PROGRESS", description: "Runner sudah bekerja dan escrow dalam pengawasan." },
];

export const dashboardGiverImpactCounterItemsSeed: DashboardImpactCounterItem[] = [
  { label: "Quest Terpenuhi Minggu Ini", value: "94", hint: "7 hari terakhir", toneClass: "bg-[#DBEAFE]" },
  { label: "Total Escrow Released", value: "Rp12.2jt", hint: "release rate 87%", toneClass: "bg-[#DCFCE7]" },
  { label: "Dispute Dicegah", value: "31", hint: "brief quality meningkat", toneClass: "bg-[#FEF3C7]" },
];

export const dashboardGiverLeaderboardGroupsSeed: DashboardLeaderboardGroup[] = [
  {
    scope: "Lokal",
    items: [
      { rank: 1, name: "Aghnia", pp: "7,014", trend: "+118" },
      { rank: 2, name: "Naufal", pp: "6,802", trend: "+106" },
      { rank: 3, name: "Miska", pp: "6,410", trend: "+91" },
    ],
  },
  {
    scope: "Provinsi",
    items: [
      { rank: 1, name: "Rizki", pp: "9,112", trend: "+170" },
      { rank: 2, name: "Aghnia", pp: "7,014", trend: "+118" },
      { rank: 3, name: "Naufal", pp: "6,802", trend: "+106" },
    ],
  },
  {
    scope: "Nasional",
    items: [
      { rank: 1, name: "Salsabila", pp: "12,804", trend: "+214" },
      { rank: 2, name: "Rizki", pp: "9,112", trend: "+170" },
      { rank: 3, name: "Aghnia", pp: "7,014", trend: "+118" },
    ],
  },
];

export const dashboardGiverGeoScopeItemsSeed: DashboardGeoScopeItem[] = [
  {
    radiusValue: "ALL",
    radiusLabel: "Semua Radius",
    estimatedRunners: "63 runner",
    activeRunners: "39 online",
    avgEta: "ETA 14m",
    hotZones: ["Pasar Minggu", "Kuningan", "Cilandak"],
  },
  {
    radiusValue: "LT_2",
    radiusLabel: "< 2 km",
    estimatedRunners: "24 runner",
    activeRunners: "18 online",
    avgEta: "ETA 8m",
    hotZones: ["Cilandak", "Kemang", "Fatmawati"],
  },
  {
    radiusValue: "GTE_2",
    radiusLabel: ">= 2 km",
    estimatedRunners: "39 runner",
    activeRunners: "21 online",
    avgEta: "ETA 18m",
    hotZones: ["Tebet", "Pancoran", "Kuningan"],
  },
];

export type DashboardRoleDataSeed = {
  viewCopy: DashboardViewCopy;
  carouselItems: DashboardCarouselItem[];
  kpiItems: DashboardKpiItem[];
  questItems: DashboardQuestItem[];
  quickFilterMenus: DashboardQuickFilterMenu[];
  snapshotItems: DashboardSnapshotItem[];
  activityItems: DashboardActivityItem[];
  statusHelpItems: DashboardStatusHelpItem[];
  impactCounterItems: DashboardImpactCounterItem[];
  leaderboardGroups: DashboardLeaderboardGroup[];
  geoScopeItems: DashboardGeoScopeItem[];
};

export const dashboardRoleDataSeed: Record<"runner" | "giver", DashboardRoleDataSeed> = {
  runner: {
    viewCopy: dashboardViewCopySeed,
    carouselItems: dashboardCarouselItems,
    kpiItems: dashboardKpiItems,
    questItems: liveQuestItems,
    quickFilterMenus: dashboardQuickFilterMenus,
    snapshotItems: dashboardSnapshotItems,
    activityItems: dashboardActivityItems,
    statusHelpItems: dashboardStatusHelpItems,
    impactCounterItems: dashboardImpactCounterItems,
    leaderboardGroups: dashboardLeaderboardGroups,
    geoScopeItems: dashboardGeoScopeItems,
  },
  giver: {
    viewCopy: dashboardGiverViewCopySeed,
    carouselItems: dashboardGiverCarouselItemsSeed,
    kpiItems: dashboardGiverKpiItemsSeed,
    questItems: dashboardGiverQuestItemsSeed,
    quickFilterMenus: dashboardQuickFilterMenus,
    snapshotItems: dashboardGiverSnapshotItemsSeed,
    activityItems: dashboardGiverActivityItemsSeed,
    statusHelpItems: dashboardGiverStatusHelpItemsSeed,
    impactCounterItems: dashboardGiverImpactCounterItemsSeed,
    leaderboardGroups: dashboardGiverLeaderboardGroupsSeed,
    geoScopeItems: dashboardGiverGeoScopeItemsSeed,
  },
};
