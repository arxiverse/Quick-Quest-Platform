import type {
  PromotionCategory,
  PromotionItem,
} from "./promotion";

export const PROMOTION_SUBVIEW_STORAGE_KEY_SEED =
  "nvrs-qqm-promotion-subview-v1";

export const promotionCategoryOptionsSeed: PromotionCategory[] = [
  "Semua Jasa",
  "Jasa Digital",
  "Kreatif & Desain",
  "Jasa Fisik & Lapangan",
  "Loker & Rekrutmen",
];

export type PromotionViewCopy = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    createPostButton: string;
    draftButton: string;
  };
  toolbar: {
    searchPlaceholder: string;
    emptyStateMessage: string;
  };
  card: {
    availableLabel: string;
    busyLabel: string;
    rateLabel: string;
    negotiateButton: string;
    likeLabelSuffix: string;
  };
};

export const promotionViewCopySeed: PromotionViewCopy = {
  hero: {
    eyebrow: "Forum & Jasa Individual",
    title: "Promosikan Skil & Produkmu Sini!",
    description:
      "Menarik Giver kelas kakap nggak harus dari quest yang disediakan sistem doang. Jual jasa lo sendiri, buka komisi joki, nawarin loker, atau pamerin portofolio sakti di billboard ini.",
    createPostButton: "Buat Postingan Jasa",
    draftButton: "Cek Draft",
  },
  toolbar: {
    searchPlaceholder: "Cari joki, desain, fotografer...",
    emptyStateMessage:
      "Wah, nggak ada hasil yang nyangkut. Coba kata kunci yang lebih gampang.",
  },
  card: {
    availableLabel: "BISA DI-HIRE",
    busyLabel: "SEDANG SIBUK",
    rateLabel: "Tarif Rate",
    negotiateButton: "Ajak Nego",
    likeLabelSuffix: "Likes",
  },
};

export const promotionMockItemsSeed: PromotionItem[] = [
  {
    id: "PRM-101",
    providerName: "Neira",
    providerRole: "Elite Runner",
    title: "Jasa Bikin Website React + Tailwind Cepat",
    description:
      "Siap bantu bikin landing page keren atau web dashboard untuk toko lu dalam 3-5 hari. Clean code dan performa dijamin A+.",
    tags: ["React", "Web Dev", "Programming"],
    rate: "Mulai Rp 850.000 / Project",
    category: "Jasa Digital",
    likes: 124,
    isAvailable: true,
    avatarIcon: "💻",
  },
  {
    id: "PRM-102",
    providerName: "Rizky Santoso",
    providerRole: "Pro Photographer",
    title: "Fotografi Event & Produk Katalog",
    description:
      "Menerima job fotografi untuk event seminar, pre-wedding, maupun foto katalog produk UMKM. Punya studio mini sendiri.",
    tags: ["Fotografi", "Produk UMKM", "Event"],
    rate: "Rp 150.000 / Jam",
    category: "Kreatif & Desain",
    likes: 89,
    isAvailable: true,
    avatarIcon: "📸",
  },
  {
    id: "PRM-103",
    providerName: "Toko Sembako Aulia",
    providerRole: "Verified Giver",
    title: "Dicari: Penjaga Booth Bazar Weekend",
    description:
      "Butuh 2 orang telaten buat jaga booth sembako kita pas event CFD (Car Free Day) minggu ini. Konsumsi dan transport ditanggung.",
    tags: ["Loker Part-Time", "Event Jaga", "Sales"],
    rate: "Rp 120.000 / Shift",
    category: "Loker & Rekrutmen",
    likes: 45,
    isAvailable: true,
    avatarIcon: "🏪",
  },
  {
    id: "PRM-104",
    providerName: "Bang Jo",
    providerRole: "Runner Ahli",
    title: "Joki Rank Valorant & Mobile Legends",
    description:
      "Pusing nyangkut di badak? Sini gw bantu angkat sampai Mythic/Radiant. Akun dijamin aman dan rahasia terjamin 100%.",
    tags: ["Gaming", "Joki", "E-Sports"],
    rate: "Rp 25.000 / Bintang",
    category: "Jasa Digital",
    likes: 312,
    isAvailable: false,
    avatarIcon: "🎮",
  },
  {
    id: "PRM-105",
    providerName: "Siti Cleaning",
    providerRole: "Runner Khusus",
    title: "Panggil Jasa Deep Cleaning AC & Kamar",
    description:
      "AC netes atau kasur berdebu? Tim kita bisa datang ke kosan / rumah lu dalam 30 menit. Bawa alat vacuum cleaner sendiri.",
    tags: ["Kebersihan", "Service AC", "Fisik"],
    rate: "Mulai Rp 75.000",
    category: "Jasa Fisik & Lapangan",
    likes: 201,
    isAvailable: true,
    avatarIcon: "🧹",
  },
];
