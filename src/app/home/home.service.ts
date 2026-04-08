import type { HomeNavItem, HomeNotification, HomeProfile, HomeView, HomeViewMeta } from "./home";

export const HOME_ACTIVE_VIEW_STORAGE_KEY = "nvrs-qqm-home-active-view";
export const initialHomeView: HomeView = "dashboard";

export const homeProfile: HomeProfile = {
  name: "Neira",
  role: "Quest Runner",
  location: "Jakarta Selatan",
  email: "neiraverse@gmail.com",
  phone: "+6281234567890",
  address: "Jl. Selat Nabiru, No. 10, Kec. Bungosari, Kab. Kuruwe, Prov. Arizona Selatan",
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
};

export const desktopNavItems: HomeNavItem[] = [
  { key: "dashboard", label: "Dashboard", iconKey: "home", view: "dashboard" },
  { key: "analysis", label: "Analisis", iconKey: "analysis", view: "analysis" },
  { key: "runner", label: "Runner", iconKey: "briefcase", view: "runner" },
  { key: "recent", label: "Riwayat", iconKey: "history", view: "recent" },
  { key: "leaderboard", label: "Leaderboard", iconKey: "leaderboard", view: "leaderboard" },
  { key: "chat", label: "Chat", iconKey: "chat", view: "chat" },
  { key: "giver", label: "Giver", iconKey: "switch", view: "giver" },
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
  { key: "leaderboard", label: "Leaderboard", iconKey: "leaderboard", view: "leaderboard" },
  { key: "element", label: "Element", iconKey: "element", view: "element" },
  { key: "profile-shortcut", label: "Profile", iconKey: "user", view: "profile" },
];

export const homeActionItems: HomeNavItem[] = [{ key: "profile", label: "Profile", iconKey: "user", view: "profile" }];

export const homeNotifications: HomeNotification[] = [
  {
    id: 1,
    title: "Quest UMKM diterima",
    description: "Toko Sembako Aulia baru aja approve runner untuk shift sore.",
    tag: "Quest",
    time: "2 menit lalu",
  },
  {
    id: 2,
    title: "Reminder follow up",
    description: "Ada 3 brief yang butuh konfirmasi ulang dari giver hari ini.",
    tag: "Brief",
    time: "10 menit lalu",
  },
  {
    id: 3,
    title: "Poin mingguan naik",
    description: "Completion rate tim naik 12% dibanding minggu kemarin.",
    tag: "Insight",
    time: "25 menit lalu",
  },
  {
    id: 4,
    title: "Chat prioritas masuk",
    description: "Neira ngirim update lokasi dan minta konfirmasi task tambahan.",
    tag: "Chat",
    time: "41 menit lalu",
  },
  {
    id: 5,
    title: "Leaderboard diperbarui",
    description: "Ranking runner minggu ini berubah setelah 4 quest selesai.",
    tag: "Ranking",
    time: "1 jam lalu",
  },
];

export function getHomeViewMeta(view: HomeView): HomeViewMeta {
  return homeViewMetaMap[view];
}
