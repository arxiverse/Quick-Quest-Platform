export const FunnelSeed = {
  eyebrow: "Runner Analysis",
  title: "Quest Funnel",
  description: "Transisi stage quest dari posted sampai released/disputed untuk melihat bottleneck.",
  chips: [
    { label: "Mode Runner", toneClass: "bg-[#DBEAFE] text-[#1D4ED8]" },
    { label: "Dummy Data Ready" },
  ],
  stats: [
    {
      label: "Primary Signal",
      value: "Runner Stable",
      hint: "Kontrol aktif",
      toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
    },
    {
      label: "Secondary Signal",
      value: "Needs Monitor",
      hint: "Pantau periodik",
      toneClass: "bg-[#DCFCE7] text-[#166534]",
    },
    {
      label: "Action Window",
      value: "Next 24h",
      hint: "Iterasi cepat",
      toneClass: "bg-[#FEF3C7] text-[#92400E]",
    },
  ],
  points: [
    {
      title: "Context",
      detail: "Transisi stage quest dari posted sampai released/disputed untuk melihat bottleneck.",
    },
    {
      title: "Why It Matters",
      detail: "Section ini jadi pusat validasi konteks data untuk mode Runner di Analysis.",
      toneClass: "bg-[#DCFCE7] text-[#166534]",
    },
    {
      title: "Next",
      detail: "Ketika backend siap, ganti seed ini dari API adapter di service tanpa ubah struktur view.",
    },
  ],
};
