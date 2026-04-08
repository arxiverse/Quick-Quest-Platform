import type { DashboardCarouselItem, DashboardQuestItem } from "./dashboard";

export const dashboardCarouselItems: DashboardCarouselItem[] = [
  {
    title: "Quest UMKM Terdekat",
    subtitle: "Temukan bantuan harian dengan reward terbaik di sekitarmu.",
    accent: "from-[#ede9fe] via-[#f8f7ff] to-white",
  },
  {
    title: "Weekly Highlight",
    subtitle: "Tugas cepat dengan rating stabil dan proses yang jelas.",
    accent: "from-[#e0f2fe] via-white to-[#f8fafc]",
  },
  {
    title: "Top Performer",
    subtitle: "Quest prioritas dengan poin tinggi untuk minggu ini.",
    accent: "from-[#dcfce7] via-white to-[#f7fee7]",
  },
];

export const liveQuestItems: DashboardQuestItem[] = [
  {
    title: "Bersihkan Toko",
    owner: "Neira",
    role: "Pedagang",
    category: "Bersih - Bersih, Tukang",
    points: "+ 125 pp",
    reward: "Rp. 150.000 - Rp.250.000",
    score: "2.68",
  },
  {
    title: "Membersihkan Kandang Ayam",
    owner: "Neira",
    role: "Pedagang",
    category: "Bersih - Bersih, Cleaning Service",
    points: "+ 245 pp",
    reward: "Rp. 200.000 - Rp.350.000",
    score: "2.97",
  },
  {
    title: "Rapikan Display Warung",
    owner: "Miska",
    role: "Pemilik Usaha",
    category: "Retail, Kebersihan, Visual",
    points: "+ 180 pp",
    reward: "Rp. 175.000 - Rp.300.000",
    score: "4.12",
  },
];

