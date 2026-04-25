import type { HomeProfile } from "../../home";
import { normalizeBackendUserRole, type BackendUserRole } from "../../role.util";
import {
  profileBadgesSeed,
  profileVerificationCopySeed,
  profileVerificationSeed,
  profileVerificationStageFlowSeed,
  profileSettingsSeed,
  profileSkillBreakdownSeed,
  profileStatsSeed,
  type ProfileVerificationDocumentDraft,
  type ProfileVerificationDraft,
  type ProfileVerificationStage,
  type ProfileVerificationState,
  verificationLayerSeed,
  ppIntelligenceRowsSeed,
  growthPathItemsSeed,
  portfolioContractsSeed,
  reliabilityTrendsSeed,
  economicImpactItemsSeed,
  initialSettingStateSeed,
  profileSettingTabOrderSeed,
  profileViewCopySeed,
  type ProfileViewCopy,
  type VerificationApiResponse,
  fetchVerificationFromApi,
  saveDraftToApi,
  saveDocumentToApi,
  submitVerificationToApi,
  resubmitVerificationToApi,
  fetchVerificationHistoryFromApi,
  type VerificationDraftBody,
  type VerificationDocumentBody,
  getProfileServiceErrorMessage,
  getProfileDetailFromApi,
  type ProfileDetailPayload,
} from "./profile.service";
import type { RoleInitPayload } from "../../role.service";

export type ProfileProps = {
  profile: HomeProfile;
  compact?: boolean;
  className?: string;
  showMeta?: boolean;
};

export type ProfileStatItem = {
  label: string;
  value: string;
  toneClass: string;
  iconKey: "quest" | "pp" | "rank" | "nation" | "accuracy" | "level";
};

export type ProfileQuestItem = {
  title: string;
  owner: string;
  role: string;
  category: string;
  points: string;
  reward: string;
  score: string;
};

export type ProfileSkillBreakdownItem = {
  skill: string;
  pp: string;
  share: number;
  trend: string;
  toneClass: string;
};

export type ProfileSubView =
  | { view: "EditProfile" }
  | { view: "KycSettlement" }
  | { view: "VerificationCenter" };

export type VerificationLayer = typeof verificationLayerSeed;
export type PpIntelligenceItem = (typeof ppIntelligenceRowsSeed)[number];
export type GrowthPathItem = (typeof growthPathItemsSeed)[number];
export type PortfolioContractItem = (typeof portfolioContractsSeed)[number];
export type ReliabilityTrendItem = (typeof reliabilityTrendsSeed)[number];
export type EconomicImpactItem = (typeof economicImpactItemsSeed)[number];
export type {
  ProfileVerificationDocumentDraft,
  ProfileVerificationDraft,
  ProfileVerificationStage,
  ProfileVerificationState,
};
export type SettingTabKey = keyof typeof profileSettingsSeed;
export type SettingItem = {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
  critical?: boolean;
};
export type ProfileViewText = ProfileViewCopy;

export const PROFILE_SUBVIEW_STORAGE_KEY = "nvrs-qqm-profile-subview-v1";
export const PROFILE_VERIFICATION_STORAGE_KEY = "nvrs-qqm-profile-verification-v1";

type ProfileStorageIdentity = {
  id?: string;
  email?: string;
  phone?: string;
} | null | undefined;

export type ProfileLoadResult = {
  profile: HomeProfile;
  shouldRedirectToLogin: boolean;
  backendUserRole?: BackendUserRole;
  authorization?: string;
  errorMessage?: string;
};

export const profileStats: ProfileStatItem[] = [...profileStatsSeed];
export const verificationLayer: VerificationLayer = verificationLayerSeed;
export const profileVerificationCopy = profileVerificationCopySeed;
export const profileVerificationStageFlow = [...profileVerificationStageFlowSeed];
export const profileSkillBreakdown: ProfileSkillBreakdownItem[] = [...profileSkillBreakdownSeed];
export const profileBadges = [...profileBadgesSeed];
export const ppIntelligenceRows: PpIntelligenceItem[] = [...ppIntelligenceRowsSeed];
export const growthPathItems: GrowthPathItem[] = [...growthPathItemsSeed];
export const portfolioContracts: PortfolioContractItem[] = [...portfolioContractsSeed];
export const reliabilityTrends: ReliabilityTrendItem[] = [...reliabilityTrendsSeed];
export const economicImpactItems: EconomicImpactItem[] = [...economicImpactItemsSeed];
export const profileSettings: Record<SettingTabKey, SettingItem[]> =
  profileSettingsSeed as unknown as Record<SettingTabKey, SettingItem[]>;
export const profileSettingTabOrder: SettingTabKey[] = [...profileSettingTabOrderSeed];
export const initialProfileSettingState: Record<string, boolean> = {
  ...initialSettingStateSeed,
};
export const profileViewText: ProfileViewText = profileViewCopySeed;

function getScopedStorageKey(prefix: string, scope: string): string {
  return `${prefix}:${scope}`;
}

export function resolveProfileStorageScope(identity: ProfileStorageIdentity): string {
  const id = identity?.id?.trim();
  if (id) return id;

  const email = identity?.email?.trim().toLowerCase();
  if (email) return email;

  const phone = identity?.phone?.trim();
  if (phone) return phone;

  return "anonymous";
}

export function resolveInitialProfileSubView(scope: string): ProfileSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(
      getScopedStorageKey(PROFILE_SUBVIEW_STORAGE_KEY, scope),
    );
    if (!raw) return null;
    return JSON.parse(raw) as ProfileSubView;
  } catch {
    return null;
  }
}

export function syncProfileSubViewStorage(scope: string, subView: ProfileSubView | null): void {
  if (typeof window === "undefined") return;

  const storageKey = getScopedStorageKey(PROFILE_SUBVIEW_STORAGE_KEY, scope);
  if (subView) {
    window.localStorage.setItem(storageKey, JSON.stringify(subView));
  } else {
    window.localStorage.removeItem(storageKey);
  }
}

function sanitizeVerificationDraft(
  baseProfile: HomeProfile,
  draft: Partial<ProfileVerificationDraft> | undefined,
): ProfileVerificationDraft {
  return {
    ...profileVerificationSeed.draft,
    ...draft,
    fullLegalName: draft?.fullLegalName || baseProfile.name,
    fullAddress: draft?.fullAddress || baseProfile.address,
  };
}

function sanitizeVerificationDocuments(
  documents: Partial<ProfileVerificationDocumentDraft>[] | undefined,
): ProfileVerificationDocumentDraft[] {
  return profileVerificationSeed.documents.map((seedDocument) => {
    const matched = documents?.find((item) => item.type === seedDocument.type);
    return {
      ...seedDocument,
      ...matched,
      fileName: matched?.fileName || "",
      uploaded: Boolean(matched?.uploaded && matched?.fileName),
    };
  });
}

function createUnlockedVerificationState(baseProfile: HomeProfile): ProfileVerificationState {
  return {
    ...profileVerificationSeed,
    status: "approved",
    stage: "done",
    trustTier: "Tier A",
    riskBand: "Low Risk",
    reviewerNote: "Identitas asli sudah lolos review dan siap dipakai sebagai giver.",
    rejectionReason: "",
    needsResubmission: false,
    updatedAtLabel: "Approved via backend role",
    draft: sanitizeVerificationDraft(baseProfile, profileVerificationSeed.draft),
    documents: sanitizeVerificationDocuments(profileVerificationSeed.documents),
  };
}

export function createInitialProfileVerificationState(
  baseProfile: HomeProfile,
  backendUserRole: BackendUserRole,
): ProfileVerificationState {
  if (backendUserRole === "user_unlocked") {
    return createUnlockedVerificationState(baseProfile);
  }

  return {
    ...profileVerificationSeed,
    draft: sanitizeVerificationDraft(baseProfile, profileVerificationSeed.draft),
    documents: sanitizeVerificationDocuments(profileVerificationSeed.documents),
  };
}

export function resolveInitialProfileVerificationState(
  scope: string,
  baseProfile: HomeProfile,
  backendUserRole: BackendUserRole,
): ProfileVerificationState {
  const fallback = createInitialProfileVerificationState(baseProfile, backendUserRole);
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(
      getScopedStorageKey(PROFILE_VERIFICATION_STORAGE_KEY, scope),
    );
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<ProfileVerificationState>;
    if (!parsed || typeof parsed !== "object") return fallback;

    const hydrated: ProfileVerificationState = {
      ...fallback,
      ...parsed,
      draft: sanitizeVerificationDraft(baseProfile, parsed.draft),
      documents: sanitizeVerificationDocuments(parsed.documents),
    };

    return syncProfileVerificationWithBackend(hydrated, baseProfile, backendUserRole);
  } catch {
    return fallback;
  }
}

export function syncProfileVerificationStorage(scope: string, state: ProfileVerificationState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    getScopedStorageKey(PROFILE_VERIFICATION_STORAGE_KEY, scope),
    JSON.stringify(state),
  );
}

export function syncProfileVerificationWithBackend(
  state: ProfileVerificationState,
  baseProfile: HomeProfile,
  backendUserRole: BackendUserRole,
): ProfileVerificationState {
  if (backendUserRole === "user_unlocked") {
    const unlocked = createUnlockedVerificationState(baseProfile);
    return {
      ...unlocked,
      draft: sanitizeVerificationDraft(baseProfile, state.draft),
      documents: sanitizeVerificationDocuments(state.documents),
    };
  }

  return {
    ...state,
    draft: sanitizeVerificationDraft(baseProfile, state.draft),
    documents: sanitizeVerificationDocuments(state.documents),
  };
}

export function resolveVerificationStatusPresentation(
  verificationState: ProfileVerificationState,
): {
  pillLabel: string;
  pillClassName: string;
  actionLabel: string;
  headline: string;
} {
  if (verificationState.status === "approved") {
    return {
      pillLabel: profileVerificationCopy.unlockedLabel,
      pillClassName: "bg-[#DCFCE7] text-[#166534]",
      actionLabel: profileVerificationCopy.ctaUnlocked,
      headline: "Identity asli sudah dikunci rapi sebagai trust layer akunmu.",
    };
  }

  if (
    verificationState.status === "submitted" ||
    verificationState.status === "document_check" ||
    verificationState.status === "face_check" ||
    verificationState.status === "risk_review" ||
    verificationState.status === "manual_review"
  ) {
    return {
      pillLabel: profileVerificationCopy.progressLabel,
      pillClassName: "bg-[#DBEAFE] text-[#1D4ED8]",
      actionLabel: profileVerificationCopy.ctaReview,
      headline: "Dokumenmu sedang diproses sebelum role bisa naik ke user_unlocked.",
    };
  }

  if (
    verificationState.status === "rejected" ||
    verificationState.status === "resubmission_required"
  ) {
    return {
      pillLabel: profileVerificationCopy.rejectedLabel,
      pillClassName: "bg-[#FEE2E2] text-[#991B1B]",
      actionLabel: profileVerificationCopy.ctaContinue,
      headline: "Ada data yang perlu dirapikan dulu sebelum bisa lanjut review.",
    };
  }

  return {
    pillLabel: profileVerificationCopy.pendingLabel,
    pillClassName: "bg-[#FEF3C7] text-[#92400E]",
    actionLabel:
      verificationState.status === "draft"
        ? profileVerificationCopy.ctaContinue
        : profileVerificationCopy.ctaStart,
    headline: profileVerificationCopy.helper,
  };
}

export function resolveVerificationStageLabel(stage: ProfileVerificationStage): string {
  return (
    profileVerificationStageFlow.find((item) => item.key === stage)?.label ?? "Identitas"
  );
}

export function resolveLevelClass(level: GrowthPathItem["currentLevel"]): string {
  if (level === "Q1") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (level === "Q2") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#DCFCE7] text-[#166534]";
}

export function resolveContractStatusClass(status: PortfolioContractItem["status"]): string {
  if (status === "Completed") return "bg-[#DCFCE7] text-[#166534]";
  if (status === "In Progress") return "bg-[#DBEAFE] text-[#1D4ED8]";
  return "bg-[#FEF3C7] text-[#92400E]";
}

export function resolveReliabilityTrendClass(isGood: boolean): string {
  return isGood ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FECACA] text-[#991B1B]";
}

export function formatReliabilityValue(value: number, unit: ReliabilityTrendItem["unit"]): string {
  return unit === "%" ? `${value.toFixed(1)}%` : `${value.toFixed(1)}m`;
}

function deriveLocationFromAddress(address: string, fallbackLocation: string): string {
  const parts = address
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return parts.slice(-2).join(", ");
  }

  return fallbackLocation;
}

export function toHomeProfile(baseProfile: HomeProfile, payload: RoleInitPayload): HomeProfile {
  const backendUserRole = normalizeBackendUserRole(payload.user_role);
  const roleLabel =
    backendUserRole === "user_unlocked"
      ? "Runner + Giver (Unlocked)"
      : "Runner (Q1 Default)";

  return {
    ...baseProfile,
    name: payload.fullname || baseProfile.name,
    role: roleLabel,
    email: payload.email || baseProfile.email,
    phone: payload.phone || baseProfile.phone,
    address: payload.full_address || baseProfile.address,
    location: deriveLocationFromAddress(payload.full_address || baseProfile.address, baseProfile.location),
  };
}

function normalizeAuthorization(value: string | undefined): string {
  const normalized = value?.trim() ?? "";
  return normalized || "user";
}

export function toHomeProfileFromDetail(
  baseProfile: HomeProfile,
  payload: ProfileDetailPayload,
): HomeProfile {
  return toHomeProfile(baseProfile, {
    user_role: payload.user_role,
    authorization: normalizeAuthorization(payload.authorization),
    fullname: payload.fullname,
    email: payload.email,
    phone: payload.phone,
    full_address: payload.full_address,
  });
}

export function loadHomeProfile(baseProfile: HomeProfile, payload: RoleInitPayload | null): ProfileLoadResult {
  if (!payload) {
    return {
      profile: baseProfile,
      shouldRedirectToLogin: true,
    };
  }

  return {
    profile: toHomeProfile(baseProfile, payload),
    shouldRedirectToLogin: false,
    backendUserRole: normalizeBackendUserRole(payload.user_role),
    authorization: normalizeAuthorization(payload.authorization),
  };
}

export async function loadProfileDetail(
  baseProfile: HomeProfile,
): Promise<ProfileLoadResult> {
  const payload = await getProfileDetailFromApi();

  return {
    profile: toHomeProfileFromDetail(baseProfile, payload),
    shouldRedirectToLogin: false,
    backendUserRole: normalizeBackendUserRole(payload.user_role),
    authorization: normalizeAuthorization(payload.authorization),
  };
}

export async function loadProfileVerificationState(
  baseProfile: HomeProfile,
): Promise<ProfileVerificationState> {
  const payload = await fetchVerificationFromApi();
  return mapVerificationApiToState(payload, baseProfile);
}

export {
  profileBadgesSeed,
  profileSettingsSeed,
  profileSkillBreakdownSeed,
  profileStatsSeed,
  verificationLayerSeed,
  ppIntelligenceRowsSeed,
  growthPathItemsSeed,
  portfolioContractsSeed,
  reliabilityTrendsSeed,
  economicImpactItemsSeed,
  initialSettingStateSeed,
  // Re-export API service functions (ESVMC: tsx → ts → service)
  fetchVerificationFromApi,
  saveDraftToApi,
  saveDocumentToApi,
  submitVerificationToApi,
  resubmitVerificationToApi,
  fetchVerificationHistoryFromApi,
  type VerificationApiResponse,
  type VerificationDraftBody,
  type VerificationDocumentBody,
  type ProfileDetailPayload,
  getProfileServiceErrorMessage,
  getProfileDetailFromApi,
};

// ---- Backend → Frontend State Adapter ----

function normalizeVerificationStatus(raw: string): ProfileVerificationStatus {
  const valid: ProfileVerificationStatus[] = [
    "not_started", "draft", "submitted", "document_check",
    "face_check", "risk_review", "manual_review", "approved",
    "rejected", "resubmission_required",
  ];
  return (valid.includes(raw as ProfileVerificationStatus)
    ? raw
    : "not_started") as ProfileVerificationStatus;
}

type ProfileVerificationStatus = ProfileVerificationState["status"];

function normalizeVerificationStage(raw: string): ProfileVerificationStage {
  const valid: ProfileVerificationStage[] = [
    "identity_form", "document_upload", "selfie_check", "review", "done",
  ];
  return (valid.includes(raw as ProfileVerificationStage)
    ? raw
    : "identity_form") as ProfileVerificationStage;
}

function formatUpdatedAtLabel(data: VerificationApiResponse): string {
  if (data.approved_at) return `Approved ${new Date(data.approved_at).toLocaleDateString("id-ID")}`;
  if (data.reviewed_at) return `Review ${new Date(data.reviewed_at).toLocaleDateString("id-ID")}`;
  if (data.submitted_at) return `Disubmit ${new Date(data.submitted_at).toLocaleDateString("id-ID")}`;
  return "Draft tersimpan di backend";
}

function mapApiDocumentsToFrontend(
  apiDocs: VerificationApiResponse["documents"],
  seedDocuments: ProfileVerificationDocumentDraft[],
): ProfileVerificationDocumentDraft[] {
  return seedDocuments.map((seed) => {
    const matched = apiDocs.find((doc) => doc.document_type === seed.type);
    if (!matched || !matched.file_key) return { ...seed };
    return {
      ...seed,
      fileName: matched.file_key,
      uploaded: Boolean(matched.file_key),
    };
  });
}

export function mapVerificationApiToState(
  data: VerificationApiResponse,
  baseProfile: HomeProfile,
): ProfileVerificationState {
  const status = normalizeVerificationStatus(data.verification_status);
  const stage = normalizeVerificationStage(data.verification_stage);

  const draft: ProfileVerificationDraft = {
    fullLegalName: data.full_legal_name || "",
    nik: data.nik || "",
    birthPlace: data.birth_place || "",
    birthDate: data.birth_date ? data.birth_date.substring(0, 10) : "",
    gender: (data.gender as ProfileVerificationDraft["gender"]) || "",
    occupation: data.occupation || "",
    province: data.province || "",
    city: data.city || "",
    district: data.district || "",
    subDistrict: data.sub_district || "",
    postalCode: data.postal_code || "",
    fullAddress: data.full_address || baseProfile.address || "",
    domicileSameAsKtp: data.domicile_same_as_ktp ?? true,
  };

  const seedDocs = profileVerificationSeed.documents.map((item) => ({ ...item }));
  const documents = mapApiDocumentsToFrontend(data.documents ?? [], seedDocs);

  return {
    status,
    stage,
    trustTier: data.trust_tier || "Tier Pending",
    riskBand: data.risk_band || "Belum Dinilai",
    reviewerNote: data.latest_review_note || profileVerificationSeed.reviewerNote,
    rejectionReason: data.rejection_reason_detail || "",
    needsResubmission: data.needs_resubmission ?? false,
    updatedAtLabel: formatUpdatedAtLabel(data),
    draft,
    documents,
  };
}
