import type {
  DashboardActivityItem,
  DashboardCarouselItem,
  DashboardGeoScopeItem,
  DashboardImpactCounterItem,
  DashboardLeaderboardGroup,
  DashboardQuickFilterMenu,
  DashboardQuestItem,
  DashboardSnapshotItem,
  DashboardStatusHelpItem,
} from "./dashboard";

export const dashboardCarouselItems: DashboardCarouselItem[] = [
  {
    title: "Quest UMKM Terdekat",
    subtitle: "Temukan bantuan harian dengan reward terbaik di sekitarmu.",
    accent: "from-[#ede9fe] via-[#f8f7ff] to-white dark:from-[#312e81] dark:via-[#1f2340] dark:to-[#111827]",
  },
  {
    title: "Weekly Highlight",
    subtitle: "Tugas cepat dengan rating stabil dan proses yang jelas.",
    accent: "from-[#e0f2fe] via-white to-[#f8fafc] dark:from-[#0e7490] dark:via-[#10263f] dark:to-[#111827]",
  },
  {
    title: "Top Performer",
    subtitle: "Quest prioritas dengan poin tinggi untuk minggu ini.",
    accent: "from-[#dcfce7] via-white to-[#f7fee7] dark:from-[#166534] dark:via-[#1a2f29] dark:to-[#111827]",
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
    key: "status",
    label: "Status",
    options: [
      { value: "ALL", label: "Semua" },
      { value: "LIVE", label: "LIVE" },
      { value: "MATCH", label: "MATCH" },
      { value: "IN_PROGRESS", label: "IN_PROGRESS" },
    ],
  },
  {
    key: "radius",
    label: "Radius",
    options: [
      { value: "ALL", label: "Semua Jarak" },
      { value: "LT_2", label: "< 2 km" },
      { value: "GTE_2", label: ">= 2 km" },
    ],
  },
  {
    key: "upah",
    label: "Upah",
    options: [
      { value: "ALL", label: "Semua Upah" },
      { value: "100K-200K", label: "100K-200K" },
      { value: "200K-350K", label: "200K-350K" },
      { value: "350K+", label: "350K+" },
    ],
  },
  {
    key: "skill",
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
    key: "mode",
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
