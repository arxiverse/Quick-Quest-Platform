import type {
  LeaderboardInsightCard,
  LeaderboardPeriod,
  LeaderboardPublicFeedItem,
  LeaderboardRunnerProfile,
  LeaderboardRunnerRankHistory,
  LeaderboardScope,
  LeaderboardScopeGroup,
  LeaderboardSummaryMetric,
} from "./leaderboard";

export const leaderboardScopes: LeaderboardScope[] = ["Lokal", "Regional", "Nasional"];
export const leaderboardPeriods: LeaderboardPeriod[] = ["Weekly", "Monthly", "All-Time"];

export const leaderboardSummaryMetricMap: Record<LeaderboardPeriod, LeaderboardSummaryMetric[]> = {
  Weekly: [
    { label: "Public Competitors", value: "4,218", hint: "+164 runner aktif mingguan", tone: "bg-[#DBEAFE]" },
    { label: "Median PP", value: "2,480", hint: "scope aktif minggu ini", tone: "bg-[#DCFCE7]" },
    { label: "Top 10 Spread", value: "1,284 PP", hint: "gap rank 1-10", tone: "bg-[#FEF3C7]" },
    { label: "Update Cycle", value: "Real-time", hint: "sinkron setiap event", tone: "bg-[#E9D5FF]" },
  ],
  Monthly: [
    { label: "Public Competitors", value: "6,904", hint: "+812 runner aktif bulanan", tone: "bg-[#DBEAFE]" },
    { label: "Median PP", value: "4,910", hint: "akumulasi bulanan", tone: "bg-[#DCFCE7]" },
    { label: "Top 10 Spread", value: "2,640 PP", hint: "gap rank 1-10", tone: "bg-[#FEF3C7]" },
    { label: "Update Cycle", value: "Hourly Sync", hint: "normalisasi rank berkala", tone: "bg-[#E9D5FF]" },
  ],
  "All-Time": [
    { label: "Public Competitors", value: "19,332", hint: "runner historis tervalidasi", tone: "bg-[#DBEAFE]" },
    { label: "Median PP", value: "9,240", hint: "akumulasi sepanjang waktu", tone: "bg-[#DCFCE7]" },
    { label: "Top 10 Spread", value: "4,880 PP", hint: "gap rank 1-10", tone: "bg-[#FEF3C7]" },
    { label: "Update Cycle", value: "Event + Nightly", hint: "rekonsiliasi histori", tone: "bg-[#E9D5FF]" },
  ],
};

export const leaderboardSummaryMetrics: LeaderboardSummaryMetric[] = leaderboardSummaryMetricMap.Weekly;

export const leaderboardInsightByPeriod: Record<LeaderboardPeriod, LeaderboardInsightCard[]> = {
  Weekly: [
    {
      id: "liquidity",
      title: "Liquidity Index",
      value: "0.92",
      note: "Supply dan demand ketemu < 8 menit di 72% quest.",
      tone: "from-[#E0F2FE] to-[#F8FAFF]",
    },
    {
      id: "price-band",
      title: "Price Elasticity",
      value: "Rp60k - Rp110k",
      note: "Band upah ini punya match rate tertinggi (89%).",
      tone: "from-[#ECFDF5] to-[#F0FDF4]",
    },
    {
      id: "coverage",
      title: "Coverage Warning",
      value: "Cipete Malam",
      note: "Kandidat runner low supply setelah jam 20:00.",
      tone: "from-[#FEF9C3] to-[#FFF7ED]",
    },
  ],
  Monthly: [
    {
      id: "liquidity",
      title: "Liquidity Index",
      value: "0.88",
      note: "Median fill time turun 12% dibanding bulan lalu.",
      tone: "from-[#E0F2FE] to-[#F8FAFF]",
    },
    {
      id: "price-band",
      title: "Price Elasticity",
      value: "Rp90k - Rp180k",
      note: "Quest mid-ticket masih paling stabil untuk conversion.",
      tone: "from-[#ECFDF5] to-[#F0FDF4]",
    },
    {
      id: "coverage",
      title: "Coverage Warning",
      value: "Bekasi Timur",
      note: "Dispute ratio naik tipis untuk kategori Delivery.",
      tone: "from-[#FEF9C3] to-[#FFF7ED]",
    },
  ],
  "All-Time": [
    {
      id: "liquidity",
      title: "Liquidity Index",
      value: "0.85",
      note: "Normalisasi historis menahan outlier musiman.",
      tone: "from-[#E0F2FE] to-[#F8FAFF]",
    },
    {
      id: "price-band",
      title: "Price Elasticity",
      value: "Rp80k - Rp200k",
      note: "Di atas Rp220k butuh trust signal lebih tinggi.",
      tone: "from-[#ECFDF5] to-[#F0FDF4]",
    },
    {
      id: "coverage",
      title: "Coverage Warning",
      value: "Regional Tier-2",
      note: "Kenaikan radius 1km menurunkan drop rate 17%.",
      tone: "from-[#FEF9C3] to-[#FFF7ED]",
    },
  ],
};

export const leaderboardPublicFeed: LeaderboardPublicFeedItem[] = [
  {
    id: "pf-101",
    time: "2 menit lalu",
    title: "Neira naik ke rank #1 lokal",
    note: "Completion 7 quest berturut tanpa dispute.",
    tag: "Rank Shift",
  },
  {
    id: "pf-102",
    time: "6 menit lalu",
    title: "Aghnia tembus win streak 14 quest",
    note: "PP Cleaning +92 dari high-value quest.",
    tag: "Streak",
  },
  {
    id: "pf-103",
    time: "14 menit lalu",
    title: "Rizki bertahan #1 nasional",
    note: "Median response 3m 40s konsisten 7 hari.",
    tag: "Elite",
  },
  {
    id: "pf-104",
    time: "22 menit lalu",
    title: "Bandung Tech lane padat",
    note: "Naufal dan runner lain dorong match rate kategori Teknologi.",
    tag: "Area Pulse",
  },
];

export const leaderboardGroups: LeaderboardScopeGroup[] = [
  {
    scope: "Lokal",
    rows: [
      { id: "runner-neira", rank: 1, name: "Neira", city: "Jakarta Selatan", primarySkill: "Cleaning", level: "Q2", ppTotal: "6,495", completionRate: "97.2%", disputeRatio: "0.8%", trend: 2 },
      { id: "runner-miska", rank: 2, name: "Miska", city: "Depok", primarySkill: "Retail", level: "Q2", ppTotal: "6,220", completionRate: "95.8%", disputeRatio: "1.1%", trend: -1 },
      { id: "runner-raka", rank: 3, name: "Raka", city: "Pasar Minggu", primarySkill: "Delivery", level: "Q3", ppTotal: "5,901", completionRate: "94.9%", disputeRatio: "1.3%", trend: 1 },
      { id: "runner-farel", rank: 4, name: "Farel", city: "Bekasi", primarySkill: "Survey", level: "Q2", ppTotal: "5,684", completionRate: "93.7%", disputeRatio: "1.9%", trend: 0 },
      { id: "runner-aghnia", rank: 5, name: "Aghnia", city: "Cilandak", primarySkill: "Cleaning", level: "Q3", ppTotal: "5,488", completionRate: "96.3%", disputeRatio: "1.0%", trend: 1 },
      { id: "runner-naufal", rank: 6, name: "Naufal", city: "Tebet", primarySkill: "Teknologi", level: "Q1", ppTotal: "5,301", completionRate: "92.5%", disputeRatio: "2.1%", trend: -2 },
    ],
  },
  {
    scope: "Regional",
    rows: [
      { id: "runner-aghnia", rank: 1, name: "Aghnia", city: "Jakarta", primarySkill: "Cleaning", level: "Q3", ppTotal: "8,112", completionRate: "96.8%", disputeRatio: "0.9%", trend: 0 },
      { id: "runner-neira", rank: 2, name: "Neira", city: "Jakarta", primarySkill: "Cleaning", level: "Q2", ppTotal: "6,495", completionRate: "97.2%", disputeRatio: "0.8%", trend: 1 },
      { id: "runner-naufal", rank: 3, name: "Naufal", city: "Bandung", primarySkill: "Teknologi", level: "Q1", ppTotal: "6,410", completionRate: "93.2%", disputeRatio: "1.8%", trend: -1 },
      { id: "runner-miska", rank: 4, name: "Miska", city: "Depok", primarySkill: "Retail", level: "Q2", ppTotal: "6,220", completionRate: "95.8%", disputeRatio: "1.1%", trend: 2 },
      { id: "runner-raka", rank: 5, name: "Raka", city: "Bogor", primarySkill: "Delivery", level: "Q3", ppTotal: "5,901", completionRate: "94.9%", disputeRatio: "1.3%", trend: 0 },
      { id: "runner-farel", rank: 6, name: "Farel", city: "Bekasi", primarySkill: "Survey", level: "Q2", ppTotal: "5,684", completionRate: "93.7%", disputeRatio: "1.9%", trend: -1 },
    ],
  },
  {
    scope: "Nasional",
    rows: [
      { id: "runner-rizki", rank: 1, name: "Rizki", city: "Surabaya", primarySkill: "Delivery", level: "Q3", ppTotal: "12,224", completionRate: "97.9%", disputeRatio: "0.7%", trend: 0 },
      { id: "runner-aghnia", rank: 2, name: "Aghnia", city: "Jakarta", primarySkill: "Cleaning", level: "Q3", ppTotal: "8,112", completionRate: "96.8%", disputeRatio: "0.9%", trend: 2 },
      { id: "runner-neira", rank: 3, name: "Neira", city: "Jakarta", primarySkill: "Cleaning", level: "Q2", ppTotal: "6,495", completionRate: "97.2%", disputeRatio: "0.8%", trend: 2 },
      { id: "runner-naufal", rank: 4, name: "Naufal", city: "Bandung", primarySkill: "Teknologi", level: "Q1", ppTotal: "6,410", completionRate: "93.2%", disputeRatio: "1.8%", trend: -1 },
      { id: "runner-miska", rank: 5, name: "Miska", city: "Depok", primarySkill: "Retail", level: "Q2", ppTotal: "6,220", completionRate: "95.8%", disputeRatio: "1.1%", trend: -1 },
      { id: "runner-raka", rank: 6, name: "Raka", city: "Bogor", primarySkill: "Delivery", level: "Q3", ppTotal: "5,901", completionRate: "94.9%", disputeRatio: "1.3%", trend: 1 },
    ],
  },
];

export const leaderboardTopProfiles: LeaderboardRunnerProfile[] = [
  {
    id: "runner-neira",
    name: "Neira",
    handle: "@neira.qqm",
    location: "Jakarta Selatan",
    joinedAt: "2025-09-12",
    headline: "Quest Runner fokus Cleaning & Retail dengan completion stabil tinggi.",
    badges: ["Fast Responder", "High Completion", "Low Dispute"],
    reliability: {
      onTimeRate: "96.8%",
      cancelRate: "1.2%",
      avgRating: "4.92",
      responseSpeed: "4m 20s",
    },
    skills: [
      { skill: "Cleaning", level: "Q2", pp: "2,140", share: 36 },
      { skill: "Retail", level: "Q2", pp: "1,860", share: 31 },
      { skill: "Delivery", level: "Q3", pp: "1,240", share: 21 },
      { skill: "Teknologi", level: "Q1", pp: "755", share: 12 },
    ],
    percentile: "Top 8%",
    nextRankGap: "120 PP ke #2 Regional",
    momentum: "+182 PP (7D)",
    milestones: [
      { label: "Streak", value: "9 quest", note: "Tanpa cancel 7 hari" },
      { label: "Escrow Released", value: "Rp3.4M", note: "Akumulasi bulanan" },
      { label: "Skill Match", value: "89%", note: "Quest relevan skill utama" },
    ],
    recentActivities: [
      { id: "neira-act-1", tag: "Quest", title: "Restock minimarket selesai", note: "Rating 4.9 dari giver", time: "10 menit lalu" },
      { id: "neira-act-2", tag: "Escrow", title: "Escrow released", note: "Rp220.000 masuk saldo runner", time: "28 menit lalu" },
      { id: "neira-act-3", tag: "Rank", title: "Rank lokal naik", note: "Naik 1 posisi setelah 2 quest selesai", time: "1 jam lalu" },
    ],
  },
  {
    id: "runner-miska",
    name: "Miska",
    handle: "@miska.ops",
    location: "Depok",
    joinedAt: "2025-10-04",
    headline: "Runner retail specialist dengan track record display task yang konsisten.",
    badges: ["Weekend Grinder", "Top Retail", "Quick Confirm"],
    reliability: {
      onTimeRate: "95.3%",
      cancelRate: "1.4%",
      avgRating: "4.86",
      responseSpeed: "5m 10s",
    },
    skills: [
      { skill: "Retail", level: "Q2", pp: "2,020", share: 42 },
      { skill: "Cleaning", level: "Q2", pp: "1,230", share: 25 },
      { skill: "Delivery", level: "Q2", pp: "980", share: 20 },
      { skill: "Teknologi", level: "Q1", pp: "590", share: 13 },
    ],
    percentile: "Top 11%",
    nextRankGap: "95 PP ke #3 Regional",
    momentum: "+146 PP (7D)",
    milestones: [
      { label: "Streak", value: "7 quest", note: "Retail lane dominan" },
      { label: "Escrow Released", value: "Rp2.7M", note: "Akumulasi bulanan" },
      { label: "Skill Match", value: "86%", note: "Quest cocok preferensi" },
    ],
    recentActivities: [
      { id: "miska-act-1", tag: "Quest", title: "Display toko selesai", note: "On-time 100%", time: "16 menit lalu" },
      { id: "miska-act-2", tag: "Rating", title: "Rating baru masuk", note: "4.8 dari giver UMKM", time: "43 menit lalu" },
      { id: "miska-act-3", tag: "Rank", title: "Regional naik", note: "Naik 2 posisi minggu ini", time: "2 jam lalu" },
    ],
  },
  {
    id: "runner-raka",
    name: "Raka",
    handle: "@raka.runner",
    location: "Pasar Minggu",
    joinedAt: "2025-08-27",
    headline: "Delivery-heavy runner dengan konsistensi malam tinggi.",
    badges: ["Night Owl", "Fast Route", "Low Dispute"],
    reliability: {
      onTimeRate: "94.9%",
      cancelRate: "1.5%",
      avgRating: "4.84",
      responseSpeed: "5m 35s",
    },
    skills: [
      { skill: "Delivery", level: "Q3", pp: "2,260", share: 44 },
      { skill: "Cleaning", level: "Q2", pp: "1,330", share: 24 },
      { skill: "Retail", level: "Q2", pp: "1,180", share: 22 },
      { skill: "Teknologi", level: "Q1", pp: "620", share: 10 },
    ],
    percentile: "Top 14%",
    nextRankGap: "210 PP ke #4 Nasional",
    momentum: "+138 PP (7D)",
    milestones: [
      { label: "Streak", value: "6 quest", note: "Prime time malam stabil" },
      { label: "Escrow Released", value: "Rp2.4M", note: "Akumulasi bulanan" },
      { label: "Skill Match", value: "84%", note: "Delivery lane kuat" },
    ],
    recentActivities: [
      { id: "raka-act-1", tag: "Quest", title: "Pickup dokumen berhasil", note: "SLA 27 menit", time: "8 menit lalu" },
      { id: "raka-act-2", tag: "Escrow", title: "Escrow lock -> release", note: "Quest selesai tanpa revisi", time: "31 menit lalu" },
      { id: "raka-act-3", tag: "Rank", title: "Lokal naik", note: "Mendekati posisi #2", time: "3 jam lalu" },
    ],
  },
  {
    id: "runner-farel",
    name: "Farel",
    handle: "@farel.pickup",
    location: "Bekasi",
    joinedAt: "2025-11-02",
    headline: "Survey + pickup runner dengan fokus reliability dan SLA.",
    badges: ["SLA Keeper", "Most Active", "Shift Stable"],
    reliability: {
      onTimeRate: "93.7%",
      cancelRate: "1.9%",
      avgRating: "4.77",
      responseSpeed: "6m 08s",
    },
    skills: [
      { skill: "Survey", level: "Q2", pp: "1,740", share: 33 },
      { skill: "Delivery", level: "Q2", pp: "1,420", share: 27 },
      { skill: "Retail", level: "Q1", pp: "1,040", share: 21 },
      { skill: "Cleaning", level: "Q1", pp: "860", share: 19 },
    ],
    percentile: "Top 17%",
    nextRankGap: "170 PP ke #5 Regional",
    momentum: "+97 PP (7D)",
    milestones: [
      { label: "Streak", value: "5 quest", note: "SLA konsisten" },
      { label: "Escrow Released", value: "Rp2.1M", note: "Akumulasi bulanan" },
      { label: "Skill Match", value: "80%", note: "Survey + Delivery blend" },
    ],
    recentActivities: [
      { id: "farel-act-1", tag: "Quest", title: "Survey area selesai", note: "Brief diterima tanpa revisi", time: "18 menit lalu" },
      { id: "farel-act-2", tag: "Rating", title: "Rating 4.7", note: "Akurasi lokasi dinilai baik", time: "1 jam lalu" },
      { id: "farel-act-3", tag: "PP", title: "PP bertambah", note: "+24 dari quality review", time: "4 jam lalu" },
    ],
  },
  {
    id: "runner-aghnia",
    name: "Aghnia",
    handle: "@aghnia.pro",
    location: "Cilandak",
    joinedAt: "2025-07-18",
    headline: "Top regional performer dengan dominasi cleaning high-value task.",
    badges: ["Regional #1", "High Accuracy", "Trusted Pro"],
    reliability: {
      onTimeRate: "96.8%",
      cancelRate: "0.9%",
      avgRating: "4.95",
      responseSpeed: "4m 02s",
    },
    skills: [
      { skill: "Cleaning", level: "Q3", pp: "3,420", share: 48 },
      { skill: "Retail", level: "Q2", pp: "1,730", share: 24 },
      { skill: "Delivery", level: "Q2", pp: "1,220", share: 18 },
      { skill: "Teknologi", level: "Q1", pp: "742", share: 10 },
    ],
    percentile: "Top 5%",
    nextRankGap: "280 PP ke #1 Nasional",
    momentum: "+240 PP (7D)",
    milestones: [
      { label: "Streak", value: "14 quest", note: "Regional lane dominan" },
      { label: "Escrow Released", value: "Rp4.8M", note: "Akumulasi bulanan" },
      { label: "Skill Match", value: "91%", note: "Cleaning high-value stabil" },
    ],
    recentActivities: [
      { id: "aghnia-act-1", tag: "Quest", title: "Deep cleaning selesai", note: "Giver repeat order", time: "5 menit lalu" },
      { id: "aghnia-act-2", tag: "Rank", title: "Regional #1 bertahan", note: "Gap 300 PP dari posisi #2", time: "37 menit lalu" },
      { id: "aghnia-act-3", tag: "Escrow", title: "Escrow release", note: "Rp310.000 selesai diproses", time: "2 jam lalu" },
    ],
  },
  {
    id: "runner-naufal",
    name: "Naufal",
    handle: "@naufal.code",
    location: "Bandung",
    joinedAt: "2025-09-29",
    headline: "Teknologi-oriented runner untuk brief coding dan troubleshooting ringan.",
    badges: ["Tech Assist", "Quick Fix", "Consistency+"],
    reliability: {
      onTimeRate: "93.2%",
      cancelRate: "1.8%",
      avgRating: "4.79",
      responseSpeed: "5m 48s",
    },
    skills: [
      { skill: "Teknologi", level: "Q1", pp: "2,120", share: 39 },
      { skill: "Retail", level: "Q2", pp: "1,420", share: 25 },
      { skill: "Cleaning", level: "Q1", pp: "1,030", share: 19 },
      { skill: "Delivery", level: "Q2", pp: "910", share: 17 },
    ],
    percentile: "Top 13%",
    nextRankGap: "155 PP ke #2 Regional",
    momentum: "+116 PP (7D)",
    milestones: [
      { label: "Streak", value: "8 quest", note: "Bugfix lane stabil" },
      { label: "Escrow Released", value: "Rp2.5M", note: "Akumulasi bulanan" },
      { label: "Skill Match", value: "88%", note: "Tech lane demand tinggi" },
    ],
    recentActivities: [
      { id: "naufal-act-1", tag: "Quest", title: "Troubleshoot POS selesai", note: "Fix < 40 menit", time: "12 menit lalu" },
      { id: "naufal-act-2", tag: "Rating", title: "Rating 4.9 masuk", note: "Respon cepat dinilai unggul", time: "54 menit lalu" },
      { id: "naufal-act-3", tag: "PP", title: "PP teknologi naik", note: "+31 dari 2 quick fix", time: "2 jam lalu" },
    ],
  },
  {
    id: "runner-rizki",
    name: "Rizki",
    handle: "@rizki.max",
    location: "Surabaya",
    joinedAt: "2025-06-30",
    headline: "Top nasional dengan volume tinggi dan on-time terbaik.",
    badges: ["National #1", "Elite Runner", "Ultra Consistent"],
    reliability: {
      onTimeRate: "97.9%",
      cancelRate: "0.7%",
      avgRating: "4.97",
      responseSpeed: "3m 42s",
    },
    skills: [
      { skill: "Delivery", level: "Q3", pp: "4,010", share: 43 },
      { skill: "Cleaning", level: "Q3", pp: "2,580", share: 27 },
      { skill: "Retail", level: "Q2", pp: "1,760", share: 19 },
      { skill: "Teknologi", level: "Q1", pp: "980", share: 11 },
    ],
    percentile: "Top 1%",
    nextRankGap: "Peringkat stabil (No gap)",
    momentum: "+301 PP (7D)",
    milestones: [
      { label: "Streak", value: "22 quest", note: "No dispute nasional" },
      { label: "Escrow Released", value: "Rp6.9M", note: "Akumulasi bulanan" },
      { label: "Skill Match", value: "93%", note: "Delivery elite lane" },
    ],
    recentActivities: [
      { id: "rizki-act-1", tag: "Quest", title: "Express delivery selesai", note: "Akurat + on-time", time: "3 menit lalu" },
      { id: "rizki-act-2", tag: "Rank", title: "Nasional #1 bertahan", note: "Stabil 6 minggu", time: "21 menit lalu" },
      { id: "rizki-act-3", tag: "Escrow", title: "Escrow release", note: "Rp480.000 final", time: "1 jam lalu" },
    ],
  },
];

export const leaderboardRankHistories: LeaderboardRunnerRankHistory[] = [
  {
    runnerId: "runner-neira",
    points: [
      { period: "W1", Lokal: 4, Regional: 5, Nasional: 7 },
      { period: "W2", Lokal: 3, Regional: 4, Nasional: 6 },
      { period: "W3", Lokal: 3, Regional: 4, Nasional: 5 },
      { period: "W4", Lokal: 2, Regional: 3, Nasional: 4 },
      { period: "W5", Lokal: 2, Regional: 2, Nasional: 3 },
      { period: "W6", Lokal: 1, Regional: 2, Nasional: 3 },
    ],
  },
  {
    runnerId: "runner-miska",
    points: [
      { period: "W1", Lokal: 2, Regional: 6, Nasional: 8 },
      { period: "W2", Lokal: 2, Regional: 5, Nasional: 7 },
      { period: "W3", Lokal: 1, Regional: 5, Nasional: 6 },
      { period: "W4", Lokal: 1, Regional: 4, Nasional: 6 },
      { period: "W5", Lokal: 2, Regional: 4, Nasional: 5 },
      { period: "W6", Lokal: 2, Regional: 4, Nasional: 5 },
    ],
  },
  {
    runnerId: "runner-raka",
    points: [
      { period: "W1", Lokal: 5, Regional: 7, Nasional: 9 },
      { period: "W2", Lokal: 5, Regional: 6, Nasional: 8 },
      { period: "W3", Lokal: 4, Regional: 6, Nasional: 8 },
      { period: "W4", Lokal: 4, Regional: 5, Nasional: 7 },
      { period: "W5", Lokal: 4, Regional: 5, Nasional: 7 },
      { period: "W6", Lokal: 3, Regional: 5, Nasional: 6 },
    ],
  },
  {
    runnerId: "runner-farel",
    points: [
      { period: "W1", Lokal: 6, Regional: 8, Nasional: 10 },
      { period: "W2", Lokal: 6, Regional: 8, Nasional: 10 },
      { period: "W3", Lokal: 5, Regional: 7, Nasional: 9 },
      { period: "W4", Lokal: 5, Regional: 7, Nasional: 8 },
      { period: "W5", Lokal: 4, Regional: 7, Nasional: 8 },
      { period: "W6", Lokal: 4, Regional: 6, Nasional: 7 },
    ],
  },
  {
    runnerId: "runner-aghnia",
    points: [
      { period: "W1", Lokal: 3, Regional: 2, Nasional: 4 },
      { period: "W2", Lokal: 3, Regional: 2, Nasional: 4 },
      { period: "W3", Lokal: 2, Regional: 2, Nasional: 4 },
      { period: "W4", Lokal: 2, Regional: 1, Nasional: 3 },
      { period: "W5", Lokal: 2, Regional: 1, Nasional: 2 },
      { period: "W6", Lokal: 5, Regional: 1, Nasional: 2 },
    ],
  },
  {
    runnerId: "runner-naufal",
    points: [
      { period: "W1", Lokal: 4, Regional: 3, Nasional: 6 },
      { period: "W2", Lokal: 4, Regional: 3, Nasional: 5 },
      { period: "W3", Lokal: 4, Regional: 3, Nasional: 5 },
      { period: "W4", Lokal: 5, Regional: 3, Nasional: 4 },
      { period: "W5", Lokal: 4, Regional: 2, Nasional: 4 },
      { period: "W6", Lokal: 6, Regional: 3, Nasional: 4 },
    ],
  },
  {
    runnerId: "runner-rizki",
    points: [
      { period: "W1", Lokal: 1, Regional: 1, Nasional: 1 },
      { period: "W2", Lokal: 1, Regional: 1, Nasional: 1 },
      { period: "W3", Lokal: 1, Regional: 1, Nasional: 1 },
      { period: "W4", Lokal: 1, Regional: 1, Nasional: 1 },
      { period: "W5", Lokal: 1, Regional: 1, Nasional: 1 },
      { period: "W6", Lokal: 1, Regional: 1, Nasional: 1 },
    ],
  },
];
