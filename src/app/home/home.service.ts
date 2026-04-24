import type { HomeNavItem, HomeNotification, HomeProfile, HomeView, HomeViewMeta } from "./home";

export const HOME_ACTIVE_VIEW_STORAGE_KEY = "nvrs-qqm-home-active-view";
export const initialHomeView: HomeView = "dashboard";

export const homeProfile: HomeProfile = {
  name: "",
  role: "Runner (Q1 Default)",
  location: "",
  email: "",
  phone: "",
  address: "",
};

export const homeViewMetaMap: Record<HomeView, HomeViewMeta> = {
  dashboard: {
    eyebrow: "Dashboard",
    title: "Pantau semua quest aktif dari satu tempat.",
    description: "View utama buat ngecek carousel, quest berjalan, dan alur kerja harian tanpa pindah halaman.",
    searchPlaceholder: "Cari quest, runner, atau kategori",
  },
  analysis: {
    eyebrow: "Analisis",
    title: "Lihat performa, tren, dan bottleneck quest.",
    description: "Cocok buat ngebaca ritme job, completion rate, dan area yang paling butuh perhatian.",
    searchPlaceholder: "Cari insight atau metrik",
  },
  runner: {
    eyebrow: "Runner",
    title: "Atur daftar runner yang lagi siap turun lapangan.",
    description: "Semua pipeline runner aktif, status ketersediaan, dan job assignment kumpul di sini.",
    searchPlaceholder: "Cari runner atau skill",
  },
  recent: {
    eyebrow: "Riwayat",
    title: "Jejak aktivitas terbaru tetap kebaca rapi.",
    description: "Buat ngecek quest yang baru selesai, perubahan status, dan aktivitas penting terakhir.",
    searchPlaceholder: "Cari riwayat aktivitas",
  },
  leaderboard: {
    eyebrow: "Leaderboard",
    title: "Ranking performa terbaik minggu ini.",
    description: "Ngebantu lihat runner paling konsisten, poin tertinggi, dan momentum tim secara cepat.",
    searchPlaceholder: "Cari ranking atau nama runner",
  },
  chat: {
    eyebrow: "Chat",
    title: "Percakapan kerja tetap dekat sama task yang lagi jalan.",
    description: "Update lapangan, reminder cepat, sama diskusi singkat biar nggak nyasar ke luar flow kerja.",
    searchPlaceholder: "Cari percakapan atau pesan",
  },
  giver: {
    eyebrow: "Giver",
    title: "Kontrol campaign dan permintaan dari sisi pemberi quest.",
    description: "Area buat ngerapihin brief, budget, prioritas, dan distribusi request ke runner.",
    searchPlaceholder: "Cari campaign atau brief",
  },
  element: {
    eyebrow: "Element",
    title: "Playground UI yang padat, rapi, dan siap dipinjam ke halaman lain.",
    description: "Tempat kita nampung elemen dashboard ala TailAdmin dan density ala AdminOne sebelum disebar ke fitur utama.",
    searchPlaceholder: "Cari component, chart, atau pattern UI",
  },
  profile: {
    eyebrow: "Profil",
    title: "Ringkasan akun, performa, dan quest dari satu tempat.",
    description: "Halaman profil buat lihat identitas, statistik penting, dan quest giver yang lagi aktif.",
    searchPlaceholder: "Cari quest atau statistik profil",
  },
  promotion: {
    eyebrow: "Jasa Individual",
    title: "Promosikan skill & jasamu biar dilirik Giver elit.",
    description: "Etalase terbuka tempat lo bisa jual jasa fotografi, jadi joki game, bikin web, sampai promosi lowongan khusus. Papan billboard-nya anak QQM buat unjuk gigi.",
    searchPlaceholder: "Cari skill, jasa, toko, atau nama user",
  },
  dispute: {
    eyebrow: "Dispute Center",
    title: "Selesaikan sengketa dengan bukti dan mediasi.",
    description: "Pusat penyelesaian sengketa 3 lapis: Auto Timer → Evidence Upload → Mediasi Platform. Dana dijamin aman selama proses berlangsung.",
    searchPlaceholder: "Cari dispute ID atau quest",
  },
};

export const desktopNavItems: HomeNavItem[] = [
  { key: "dashboard", label: "Dashboard", iconKey: "home", view: "dashboard" },
  { key: "analysis", label: "Analisis", iconKey: "analysis", view: "analysis" },
  { key: "runner", label: "Runner", iconKey: "briefcase", view: "runner" },
  { key: "promotion", label: "Promosi Jasa", iconKey: "star", view: "promotion" },
  { key: "recent", label: "Riwayat", iconKey: "history", view: "recent" },
  { key: "leaderboard", label: "Leaderboard", iconKey: "leaderboard", view: "leaderboard" },
  { key: "chat", label: "Chat", iconKey: "chat", view: "chat" },
  { key: "giver", label: "Giver", iconKey: "switch", view: "giver" },
  { key: "dispute", label: "Dispute", iconKey: "shield", view: "dispute" },
  { key: "element", label: "Element", iconKey: "element", view: "element" },
];

export const mobileNavItems: HomeNavItem[] = [
  { key: "dashboard", label: "Dashboard", mobileLabel: "Home", iconKey: "home", view: "dashboard" },
  { key: "analysis", label: "Analisis", iconKey: "analysis", view: "analysis" },
  { key: "giver", label: "Giver", iconKey: "switch", view: "giver" },
  { key: "recent", label: "Riwayat", iconKey: "history", view: "recent" },
  { key: "chat", label: "Chat", iconKey: "chat", view: "chat" },
];

export const mobileShortcutItems: HomeNavItem[] = [
  { key: "runner", label: "Runner", iconKey: "briefcase", view: "runner" },
  { key: "promotion", label: "Promosi Jasa", iconKey: "star", view: "promotion" },
  { key: "leaderboard", label: "Leaderboard", iconKey: "leaderboard", view: "leaderboard" },
  { key: "element", label: "Element", iconKey: "element", view: "element" },
  { key: "profile-shortcut", label: "Profile", iconKey: "user", view: "profile" },
];

export const homeActionItems: HomeNavItem[] = [{ key: "profile", label: "Profile", iconKey: "user", view: "profile" }];

export const homeNotifications: HomeNotification[] = [
  {
    id: 1,
    title: "Quest Tersedia di Sekitarmu",
    description: "PT. Sentra Solusi broadcast quest 'Bersih-bersih Kantor' — 0.8km dari posisimu. Upah Rp 100rb–150rb.",
    tag: "Quest",
    time: "5 menit lalu",
  },
  {
    id: 2,
    title: "Match Ditemukan!",
    description: "Skill Cleaning kamu 94% cocok dengan quest 'Floor Maintenance Hari Ini'. Sistem menunggu konfirmasimu.",
    tag: "Match",
    time: "12 menit lalu",
  },
  {
    id: 3,
    title: "Escrow Dikunci",
    description: "Dana Rp 350.000 untuk quest QST-7744 berhasil di-escrow oleh CV. Nusantara Digital. Aman!",
    tag: "Escrow",
    time: "28 menit lalu",
  },
  {
    id: 4,
    title: "Pesan Baru dari Giver",
    description: "Neo Comm mengirim pin lokasi dan brief tambahan untuk quest Event Organizer Staff besok.",
    tag: "Chat",
    time: "1 jam lalu",
  },
  {
    id: 5,
    title: "Leaderboard Diperbarui",
    description: "Kamu naik ke rank #8 lokal setelah 3 quest selesai minggu ini. +220 PP total.",
    tag: "Ranking",
    time: "2 jam lalu",
  },
  {
    id: 6,
    title: "Dana Berhasil Cair ✅",
    description: "Rp 120.000 dari quest QST-7821 sudah masuk ke QQ Wallet. Terima kasih sudah kerja keras!",
    tag: "Release",
    time: "3 jam lalu",
  },
  {
    id: 7,
    title: "Rating Baru Diterima ⭐",
    description: "Giver 'Toko Sembako Aulia' memberi rating 5/5. Reliability Badge 'High Completion' kamu diperbarui.",
    tag: "Rating",
    time: "Kemarin, 21:30",
  },
  {
    id: 8,
    title: "Dispute Diselesaikan",
    description: "Sengketa DSP-003 ('Antar Dokumen ke Notaris') ditutup — kamu memenangkan mediasi. Dana Rp 75.000 cair.",
    tag: "Dispute",
    time: "Kemarin, 14:15",
  },
];


export function getHomeViewMeta(view: HomeView): HomeViewMeta {
  return homeViewMetaMap[view];
}
