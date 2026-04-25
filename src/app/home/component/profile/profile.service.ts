import GlobalEndpoint, { ApiRequestError, postJson, requestJson } from "../../../global.service";
import type { BackendUserRole } from "../../role.util";

export type ProfileDetailPayload = {
  fullname: string;
  email: string;
  phone: string;
  full_address: string;
  authorization: string;
  user_role: BackendUserRole;
};

export type ProfileDetailResponse = {
  success: boolean;
  message: string;
  data?: ProfileDetailPayload;
};

export type ProfileVerificationStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "document_check"
  | "face_check"
  | "risk_review"
  | "manual_review"
  | "approved"
  | "rejected"
  | "resubmission_required";

export type ProfileVerificationStage =
  | "identity_form"
  | "document_upload"
  | "selfie_check"
  | "review"
  | "done";

export type ProfileVerificationDocumentType =
  | "ktp_front"
  | "selfie"
  | "selfie_with_ktp"
  | "liveness_video";

export type ProfileVerificationGender = "male" | "female" | "other" | "";

export type ProfileVerificationDraft = {
  fullLegalName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: ProfileVerificationGender;
  occupation: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  fullAddress: string;
  domicileSameAsKtp: boolean;
};

export type ProfileVerificationDocumentDraft = {
  type: ProfileVerificationDocumentType;
  label: string;
  helper: string;
  required: boolean;
  fileName: string;
  uploaded: boolean;
};

export type ProfileVerificationState = {
  status: ProfileVerificationStatus;
  stage: ProfileVerificationStage;
  trustTier: string;
  riskBand: string;
  reviewerNote: string;
  rejectionReason: string;
  needsResubmission: boolean;
  updatedAtLabel: string;
  draft: ProfileVerificationDraft;
  documents: ProfileVerificationDocumentDraft[];
};

export async function getProfileDetailFromApi(): Promise<ProfileDetailPayload> {
  const endpoints = GlobalEndpoint();
  const response = await requestJson<ProfileDetailResponse>(endpoints.profile.detail, {
    method: "GET",
    credentials: "include",
  });

  return requireApiData(response, "Data profile dari backend tidak valid.");
}

export function getProfileServiceErrorStatus(error: unknown): number | null {
  return error instanceof ApiRequestError ? error.statusCode : null;
}

export function getProfileServiceErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiRequestError || error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

// ---- Verification API Contracts (from Codex backend) ----

export type VerificationApiDocument = {
  id: string;
  document_type: string;
  file_key: string;
  file_url: string;
  mime_type: string;
  file_size: number | null;
  document_number: string;
  ocr_name: string;
  ocr_nik: string;
  ocr_birth_date: string | null;
  ocr_address: string;
  ocr_confidence: number | null;
  is_primary: boolean;
  validation_status: string;
  uploaded_at: string | null;
  validated_at: string | null;
};

export type VerificationApiResponse = {
  verification_profile_id: string;
  auth_user_id: string;
  full_legal_name: string;
  nik: string;
  birth_place: string;
  birth_date: string | null;
  gender: string;
  occupation: string;
  province: string;
  city: string;
  district: string;
  sub_district: string;
  postal_code: string;
  full_address: string;
  domicile_same_as_ktp: boolean;
  verification_status: string;
  verification_stage: string;
  risk_score: number | null;
  risk_flags: string[] | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason_code: string;
  rejection_reason_detail: string;
  needs_resubmission: boolean;
  user_role: string;
  can_post_quest: boolean;
  trust_tier: string;
  risk_band: string;
  latest_review_note: string;
  documents: VerificationApiDocument[];
};

export type VerificationApiWrapped = {
  success: boolean;
  message: string;
  data?: VerificationApiResponse;
};

export type VerificationDraftBody = {
  full_legal_name?: string;
  nik?: string;
  birth_place?: string;
  birth_date?: string;
  gender?: string;
  occupation?: string;
  province?: string;
  city?: string;
  district?: string;
  sub_district?: string;
  postal_code?: string;
  full_address?: string;
  domicile_same_as_ktp?: boolean;
};

export type VerificationDocumentBody = {
  document_type: string;
  file_key: string;
  file_url?: string;
  mime_type?: string;
  file_size?: number;
  document_number?: string;
  ocr_name?: string;
  ocr_nik?: string;
  ocr_birth_date?: string;
  ocr_address?: string;
  ocr_confidence?: number;
  is_primary?: boolean;
  validation_status?: string;
};

export type VerificationHistoryApiResponse = {
  success: boolean;
  message: string;
  data?: {
    reviews: Array<{
      id: string;
      review_type: string;
      review_result: string;
      reviewer_id: string | null;
      reviewer_role: string;
      review_notes: string;
      decision_reason_code: string;
      decision_reason_detail: string;
      created_at: string | null;
    }>;
    events: Array<{
      id: string;
      previous_status: string;
      new_status: string;
      actor_id: string | null;
      actor_type: string;
      notes: string;
      created_at: string | null;
    }>;
  };
};

function requireApiData<TWrapped extends { success: boolean; message: string; data?: TData }, TData>(
  response: TWrapped,
  fallbackMessage: string,
): TData {
  if (!response.success || !response.data) {
    throw new ApiRequestError(response.message || fallbackMessage, 500);
  }

  return response.data;
}

export async function fetchVerificationFromApi(): Promise<VerificationApiResponse> {
  const endpoints = GlobalEndpoint();
  const response = await requestJson<VerificationApiWrapped>(
    endpoints.profile.verification.detail,
    { method: "GET", credentials: "include" },
  );
  return requireApiData(response, "Data verification tidak valid dari backend.");
}

export async function saveDraftToApi(body: VerificationDraftBody): Promise<VerificationApiResponse> {
  const endpoints = GlobalEndpoint();
  const response = await postJson<VerificationDraftBody, VerificationApiWrapped>(
    endpoints.profile.verification.draft,
    body,
  );
  return requireApiData(response, "Gagal menyimpan draft verification.");
}

export async function saveDocumentToApi(
  body: VerificationDocumentBody,
): Promise<VerificationApiResponse> {
  const endpoints = GlobalEndpoint();
  const response = await postJson<VerificationDocumentBody, VerificationApiWrapped>(
    endpoints.profile.verification.documents,
    body,
  );
  return requireApiData(response, "Gagal menyimpan dokumen verification.");
}

export async function submitVerificationToApi(): Promise<VerificationApiResponse> {
  const endpoints = GlobalEndpoint();
  const response = await postJson<Record<string, never>, VerificationApiWrapped>(
    endpoints.profile.verification.submit,
    {},
  );
  return requireApiData(response, "Gagal submit verification.");
}

export async function resubmitVerificationToApi(): Promise<VerificationApiResponse> {
  const endpoints = GlobalEndpoint();
  const response = await postJson<Record<string, never>, VerificationApiWrapped>(
    endpoints.profile.verification.resubmit,
    {},
  );
  return requireApiData(response, "Gagal resubmit verification.");
}

export async function fetchVerificationHistoryFromApi() {
  const endpoints = GlobalEndpoint();
  const response = await requestJson<VerificationHistoryApiResponse>(
    endpoints.profile.verification.history,
    { method: "GET", credentials: "include" },
  );
  return requireApiData(response, "Gagal mengambil history verification.");
}

export const profileVerificationStageFlowSeed = [
  {
    key: "identity_form",
    label: "Identitas",
    description: "Isi data legal sesuai identitas resmi.",
  },
  {
    key: "document_upload",
    label: "Dokumen",
    description: "Upload KTP dan bukti pendukung verifikasi.",
  },
  {
    key: "selfie_check",
    label: "Selfie Check",
    description: "Lengkapi selfie dan selfie sambil pegang KTP.",
  },
  {
    key: "review",
    label: "Review",
    description: "Backend dan tim compliance mengecek kelayakan.",
  },
  {
    key: "done",
    label: "Unlocked",
    description: "Role siap naik ke user_unlocked saat approved.",
  },
] as const satisfies ReadonlyArray<{
  key: ProfileVerificationStage;
  label: string;
  description: string;
}>;

export const profileVerificationDocumentSeed = [
  {
    type: "ktp_front",
    label: "Foto KTP Bagian Depan",
    helper: "Pastikan teks KTP terbaca dan tidak blur.",
    required: true,
    fileName: "",
    uploaded: false,
  },
  {
    type: "selfie",
    label: "Selfie Wajah",
    helper: "Pakai cahaya yang cukup dan wajah terlihat jelas.",
    required: true,
    fileName: "",
    uploaded: false,
  },
  {
    type: "selfie_with_ktp",
    label: "Selfie Sambil Memegang KTP",
    helper: "Wajah dan KTP harus terlihat dalam satu frame.",
    required: true,
    fileName: "",
    uploaded: false,
  },
  {
    type: "liveness_video",
    label: "Video Liveness",
    helper: "Masih opsional untuk FE seed, tapi sudah disiapkan tempatnya.",
    required: false,
    fileName: "",
    uploaded: false,
  },
] as const satisfies ReadonlyArray<ProfileVerificationDocumentDraft>;

export const profileVerificationSeed: ProfileVerificationState = {
  status: "not_started",
  stage: "identity_form",
  trustTier: "Tier Pending",
  riskBand: "Belum Dinilai",
  reviewerNote: "Lengkapi identitas asli untuk membuka akses giver.",
  rejectionReason: "",
  needsResubmission: false,
  updatedAtLabel: "Belum pernah disubmit",
  draft: {
    fullLegalName: "",
    nik: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    occupation: "",
    province: "",
    city: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    fullAddress: "",
    domicileSameAsKtp: true,
  },
  documents: profileVerificationDocumentSeed.map((item) => ({ ...item })),
};

export const profileVerificationCopySeed = {
  ctaStart: "Mulai Verifikasi",
  ctaContinue: "Lanjutkan Verifikasi",
  ctaReview: "Lihat Status Review",
  ctaUnlocked: "Detail Verifikasi",
  pendingLabel: "Butuh Verifikasi Identitas",
  progressLabel: "Verifikasi Sedang Diproses",
  unlockedLabel: "Identity Unlocked",
  rejectedLabel: "Perlu Resubmisi",
  helper:
    "Lengkapi verifikasi identitas di Profile agar backend nanti bisa meng-upgrade role menjadi user_unlocked.",
} as const;

export const profileStatsSeed = [
  {
    label: "Quest Selesai",
    value: "394",
    toneClass: "text-[#00D7BE]",
    iconKey: "quest",
  },
  {
    label: "Total PP",
    value: "6,495",
    toneClass: "text-[#FF27C8]",
    iconKey: "pp",
  },
  {
    label: "Rank Lokal",
    value: "#1",
    toneClass: "text-[#6B21FF]",
    iconKey: "rank",
  },
  {
    label: "Rank Nasional",
    value: "#3",
    toneClass: "text-[#00A63E]",
    iconKey: "nation",
  },
  {
    label: "Akurasi",
    value: "99.58%",
    toneClass: "text-[#FF2F2F]",
    iconKey: "accuracy",
  },
  {
    label: "Tier Aktif",
    value: "Q2",
    toneClass: "text-[#6B21FF]",
    iconKey: "level",
  },
] as const;

export const verificationLayerSeed = {
  kycStatus: "Belum Diverifikasi",
  verifiedBadge: "Pending Identity Review",
  trustTier: "Tier Pending",
  riskBand: "Belum Dinilai",
  lastReview: "Belum ada review",
} as const;

export const profileSkillBreakdownSeed = [
  {
    skill: "Cleaning Service",
    pp: "2,140 PP",
    share: 36,
    trend: "+4.2%",
    toneClass: "bg-[#3B82F6]",
  },
  {
    skill: "Retail Helper",
    pp: "1,860 PP",
    share: 31,
    trend: "+2.1%",
    toneClass: "bg-[#10B981]",
  },
  {
    skill: "Delivery Support",
    pp: "1,240 PP",
    share: 21,
    trend: "-0.8%",
    toneClass: "bg-[#F59E0B]",
  },
  {
    skill: "Tech Assist",
    pp: "755 PP",
    share: 12,
    trend: "+5.0%",
    toneClass: "bg-[#A855F7]",
  },
] as const;

export const profileBadgesSeed = [
  {
    id: "b1",
    label: "Night Owl",
    type: "gold",
    icon: "🦉",
    desc: "Selesai 50 quest malam",
  },
  {
    id: "b2",
    label: "Elite Runner",
    type: "mythic",
    icon: "⚡",
    desc: "Top 5% Regional",
  },
  {
    id: "b3",
    label: "Fast Responder",
    type: "silver",
    icon: "🚀",
    desc: "Respon < 5 menit",
  },
  {
    id: "b4",
    label: "Trusted Pro",
    type: "bronze",
    icon: "🤝",
    desc: "Rating 4.9+",
  },
] as const;

export const ppIntelligenceRowsSeed = [
  {
    skill: "Cleaning Service",
    rating: 4.9,
    difficulty: 1.25,
    valueFactor: 1.2,
    decay: 0.95,
    result: 6.98,
    growth: "+8.6%",
  },
  {
    skill: "Retail Helper",
    rating: 4.8,
    difficulty: 1.1,
    valueFactor: 1.15,
    decay: 0.94,
    result: 5.72,
    growth: "+6.4%",
  },
  {
    skill: "Delivery Support",
    rating: 4.7,
    difficulty: 1.18,
    valueFactor: 1.05,
    decay: 0.92,
    result: 5.36,
    growth: "+4.9%",
  },
  {
    skill: "Tech Assist",
    rating: 4.8,
    difficulty: 1.32,
    valueFactor: 1.28,
    decay: 0.87,
    result: 6.98,
    growth: "+9.2%",
  },
] as const;

export const growthPathItemsSeed = [
  {
    skill: "Cleaning Service",
    currentLevel: "Q2",
    progressToNext: 72,
    requirement: "Butuh 320 PP + completion > 96% untuk Q3.",
    nextLevel: "Q3",
    note: "Fokus quest high-value dengan bukti hasil lengkap.",
  },
  {
    skill: "Retail Helper",
    currentLevel: "Q2",
    progressToNext: 63,
    requirement: "Butuh 410 PP + repeat giver rate >= 35%.",
    nextLevel: "Q3",
    note: "Pertahankan rating di atas 4.8 selama 30 hari.",
  },
  {
    skill: "Delivery Support",
    currentLevel: "Q3",
    progressToNext: 100,
    requirement: "Level puncak tercapai, pertahankan dispute < 1.5%.",
    nextLevel: "Maintain Q3",
    note: "Stabilkan SLA malam dan minimalkan cancel.",
  },
  {
    skill: "Tech Assist",
    currentLevel: "Q1",
    progressToNext: 54,
    requirement: "Butuh 280 PP + 12 quest sukses untuk Q2.",
    nextLevel: "Q2",
    note: "Ambil quest troubleshooting jam 18.00 - 21.00.",
  },
] as const;

export const portfolioContractsSeed = [
  {
    id: "CTR-2026-0412-901",
    title: "Restock Minimarket Harian",
    mode: "Per-Individu",
    role: "Runner",
    valueDelivered: "Rp250.000",
    repeatGiverRate: "42%",
    impact: "Stok UMKM stabil sebelum jam sibuk.",
    status: "In Progress",
  },
  {
    id: "CTR-2026-0411-882",
    title: "Survey Display Snack UMKM",
    mode: "Per-Individu",
    role: "Runner",
    valueDelivered: "Rp285.000",
    repeatGiverRate: "38%",
    impact: "Penjualan display naik 14% (dummy insight).",
    status: "Pending Confirmation",
  },
  {
    id: "CTR-2026-0410-744",
    title: "Bersihkan Booth Event",
    mode: "Ber-Kelompok",
    role: "Lead Runner",
    valueDelivered: "Rp380.000",
    repeatGiverRate: "51%",
    impact: "SLA selesai 32 menit lebih cepat dari target.",
    status: "Completed",
  },
  {
    id: "CTR-2026-0409-612",
    title: "Pickup Dokumen Kantor",
    mode: "Per-Individu",
    role: "Runner",
    valueDelivered: "Rp180.000",
    repeatGiverRate: "47%",
    impact: "Dokumen tiba sesuai SLA tanpa dispute.",
    status: "Completed",
  },
] as const;

export const reliabilityTrendsSeed = [
  {
    metric: "On-time Rate",
    d7: 96.8,
    d30: 95.9,
    target: 95,
    unit: "%",
    preferred: "high",
  },
  {
    metric: "Cancel Rate",
    d7: 1.2,
    d30: 1.6,
    target: 2,
    unit: "%",
    preferred: "low",
  },
  {
    metric: "Dispute Ratio",
    d7: 0.8,
    d30: 1.1,
    target: 1.5,
    unit: "%",
    preferred: "low",
  },
  {
    metric: "First Response",
    d7: 4.2,
    d30: 5.1,
    target: 5,
    unit: "m",
    preferred: "low",
  },
] as const;

export const economicImpactItemsSeed = [
  {
    label: "Total Upah Diterima",
    value: "Rp18.6jt",
    hint: "30 hari terakhir (runner side)",
    tone: "bg-[#DBEAFE]",
  },
  {
    label: "Total Upah Dibayar",
    value: "Rp3.2jt",
    hint: "sebagai giver untuk 14 quest",
    tone: "bg-[#DCFCE7]",
  },
  {
    label: "Kontribusi Fee Platform",
    value: "Rp1.1jt",
    hint: "mendukung escrow + trust engine",
    tone: "bg-[#FEF3C7]",
  },
  {
    label: "Quest Komunitas Selesai",
    value: "342",
    hint: "impact sosial di ekosistem QQM",
    tone: "bg-[#E9D5FF]",
  },
] as const;

export const profileSettingsSeed = {
  Umum: [
    {
      id: "general-public-profile",
      label: "Profil publik terlihat",
      description: "Tampilkan badge, rank, dan skill utama.",
      defaultEnabled: true,
    },
    {
      id: "general-show-location",
      label: "Tampilkan wilayah",
      description: "Bagikan area umum tanpa alamat detail.",
      defaultEnabled: true,
    },
    {
      id: "general-career-headline",
      label: "Headline karier",
      description: "Aktifkan headline kontribusi QQM pada profil.",
      defaultEnabled: true,
    },
  ],
  Notifikasi: [
    {
      id: "notif-match",
      label: "Notif match quest",
      description: "Terima notifikasi saat quest cocok dengan skill aktif.",
      defaultEnabled: true,
    },
    {
      id: "notif-escrow",
      label: "Notif escrow state",
      description: "Update UNPAID, LOCKED, IN_PROGRESS, RELEASED.",
      defaultEnabled: true,
    },
    {
      id: "notif-promo",
      label: "Notif insight/promo",
      description: "Saran upah/radius dan campaign mingguan.",
      defaultEnabled: false,
    },
  ],
  Personalisasi: [
    {
      id: "personal-dark-mode",
      label: "Mode tampilan adaptif",
      description: "Sesuaikan tema berdasarkan preferensi perangkat.",
      defaultEnabled: true,
    },
    {
      id: "personal-language",
      label: "Bahasa Indonesia prioritas",
      description: "Gunakan copy UX utama dalam Bahasa Indonesia.",
      defaultEnabled: true,
    },
    {
      id: "personal-dashboard-focus",
      label: "Fokus skill feed",
      description: "Prioritaskan feed berdasarkan lane skill favorit.",
      defaultEnabled: true,
    },
    {
      id: "personal-dynamic-animation",
      label: "Animasi Dinamis (*)",
      description:
        "Matikan untuk menghemat resource (Global Aurora & Glow Effect).",
      defaultEnabled: true,
    },
  ],
  "Kontrol Data": [
    {
      id: "data-export",
      label: "Izinkan export data",
      description: "Download riwayat quest, PP ledger, dan transaksi escrow.",
      defaultEnabled: true,
    },
    {
      id: "data-share-analytics",
      label: "Share data analytics",
      description: "Bantu optimasi matching QQM secara anonim.",
      defaultEnabled: true,
    },
    {
      id: "data-retention",
      label: "Retensi data minimum",
      description: "Simpan data sensitif hanya sesuai SLA platform.",
      defaultEnabled: false,
    },
  ],
  Security: [
    {
      id: "security-2fa",
      label: "2FA akun",
      description: "Gunakan OTP saat login perangkat baru.",
      defaultEnabled: true,
      critical: true,
    },
    {
      id: "security-session-alert",
      label: "Alert sesi baru",
      description: "Kirim notifikasi jika ada login tidak dikenal.",
      defaultEnabled: true,
      critical: true,
    },
    {
      id: "security-payout-lock",
      label: "Payout lock protection",
      description: "Butuh konfirmasi tambahan saat ubah akun payout.",
      defaultEnabled: true,
      critical: true,
    },
  ],
} as const;

export const initialSettingStateSeed = Object.fromEntries(
  Object.values(profileSettingsSeed)
    .flat()
    .map((item) => [item.id, item.defaultEnabled]),
) as Record<string, boolean>;

export const profileSettingTabOrderSeed = [
  "Umum",
  "Notifikasi",
  "Personalisasi",
  "Kontrol Data",
  "Security",
] as const;

export type ProfileViewCopy = {
  identityEyebrow: string;
  waitingGiverLabel: string;
  giverActiveLabel: string;
  editButtonLabel: string;
  logoutButtonLabel: string;
  verificationEyebrow: string;
  verificationTitle: string;
  verificationLastReviewPrefix: string;
  trophyEyebrow: string;
  trophyTitle: string;
  ppIntelligenceEyebrow: string;
  ppIntelligenceTitle: string;
  ppFormulaLabel: string;
  growthPathEyebrow: string;
  growthPathTitle: string;
  growthPathTargetPrefix: string;
  portfolioEyebrow: string;
  portfolioTitle: string;
  portfolioValuePrefix: string;
  portfolioRepeatPrefix: string;
  reliabilityEyebrow: string;
  reliabilityTitle: string;
  reliabilityImproveLabel: string;
  reliabilityAttentionLabel: string;
  economicEyebrow: string;
  withdrawBalanceLabel: string;
  economicTitle: string;
  settingsEyebrow: string;
  settingsTitle: string;
  settingsActivationPrefix: string;
  settingsCriticalLabel: string;
  ppBreakdownEyebrow: string;
  ppBreakdownTitle: string;
};

export const profileViewCopySeed: ProfileViewCopy = {
  identityEyebrow: "Identity",
  waitingGiverLabel: "Menunggu Verifikasi Giver",
  giverActiveLabel: "Mode Giver Aktif",
  editButtonLabel: "Ubah",
  logoutButtonLabel: "Logout",
  verificationEyebrow: "Verification Layer",
  verificationTitle: "KYC, Verified Badge, dan Trust Tier",
  verificationLastReviewPrefix: "Review terakhir:",
  trophyEyebrow: "Trophy & Badges",
  trophyTitle: "Pencapaian Rank & Etos Kerja",
  ppIntelligenceEyebrow: "PP Intelligence",
  ppIntelligenceTitle: "Formula Breakdown: rating x difficulty x value x decay",
  ppFormulaLabel: "Formula konsep: `(Rating x Difficulty x Value) x TimeDecay`",
  growthPathEyebrow: "Growth Path Q1-Q3",
  growthPathTitle: "Progress Requirement ke Level Berikutnya per Skill",
  growthPathTargetPrefix: "Target:",
  portfolioEyebrow: "Portfolio Kontrak",
  portfolioTitle: "High-impact Quest, Repeat Giver Rate, dan Value Delivered",
  portfolioValuePrefix: "Value",
  portfolioRepeatPrefix: "Repeat",
  reliabilityEyebrow: "Reliability Trend",
  reliabilityTitle: "On-time, Cancel, Dispute (7D vs 30D)",
  reliabilityImproveLabel: "Membaik",
  reliabilityAttentionLabel: "Perlu perhatian",
  economicEyebrow: "Economic Impact",
  withdrawBalanceLabel: "Tarik Saldo",
  economicTitle: "Dampak Ekonomi dari Aktivitas QQM",
  settingsEyebrow: "Pengaturan Akun",
  settingsTitle: "Umum, Notifikasi, Personalisasi, Kontrol Data, Security",
  settingsActivationPrefix: "Aktivasi",
  settingsCriticalLabel: "Critical",
  ppBreakdownEyebrow: "PP Breakdown",
  ppBreakdownTitle: "Distribusi Performance Point per Skill",
};
