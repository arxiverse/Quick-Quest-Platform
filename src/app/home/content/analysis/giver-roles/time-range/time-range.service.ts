export const TimeRangeSeed = {
  eyebrow: "Giver Analysis",
  title: "Time Range & Compare",
  description: "Komparasi performa periode aktif vs periode sebelumnya untuk pengambilan keputusan cepat.",
  chips: [
    { label: "Mode Giver", toneClass: "bg-[#E9D5FF] text-[#6D28D9]" },
    { label: "Dummy Data Ready" },
  ],
  stats: [
    {
      label: "Primary Signal",
      value: "Giver Stable",
      hint: "Kontrol aktif",
      toneClass: "bg-[#E9D5FF] text-[#6D28D9]",
    },
    {
      label: "Secondary Signal",
      value: "Needs Monitor",
      hint: "Pantau periodik",
      toneClass: "bg-[#BFDBFE] text-[#1E3A8A]",
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
      detail: "Komparasi performa periode aktif vs periode sebelumnya untuk pengambilan keputusan cepat.",
    },
    {
      title: "Why It Matters",
      detail: "Section ini jadi pusat validasi konteks data untuk mode Giver di Analysis.",
      toneClass: "bg-[#BFDBFE] text-[#1E3A8A]",
    },
    {
      title: "Next",
      detail: "Ketika backend siap, ganti seed ini dari API adapter di service tanpa ubah struktur view.",
    },
  ],
};
