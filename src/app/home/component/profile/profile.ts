import { clearAuthSession, getValidAuthSession } from "../../../auth.guard";
import type { HomeProfile } from "../../home";
import { normalizeBackendUserRole, type BackendUserRole } from "../../role.util";
import {
  getProfileDetailFromApi,
  getProfileServiceErrorMessage,
  getProfileServiceErrorStatus,
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
  profileSettingTabOrderSeed,
  profileViewCopySeed,
  type ProfileDetailPayload,
  type ProfileViewCopy,
} from "./profile.service";

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

export type ProfileSubView = { view: "EditProfile" } | { view: "KycSettlement" };

export type VerificationLayer = typeof verificationLayerSeed;
export type PpIntelligenceItem = (typeof ppIntelligenceRowsSeed)[number];
export type GrowthPathItem = (typeof growthPathItemsSeed)[number];
export type PortfolioContractItem = (typeof portfolioContractsSeed)[number];
export type ReliabilityTrendItem = (typeof reliabilityTrendsSeed)[number];
export type EconomicImpactItem = (typeof economicImpactItemsSeed)[number];
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

export type ProfileLoadResult = {
  profile: HomeProfile;
  shouldRedirectToLogin: boolean;
  backendUserRole?: BackendUserRole;
  errorMessage?: string;
};

export const profileStats: ProfileStatItem[] = [...profileStatsSeed];
export const verificationLayer: VerificationLayer = verificationLayerSeed;
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

export function resolveInitialProfileSubView(): ProfileSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_SUBVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProfileSubView;
  } catch {
    return null;
  }
}

export function syncProfileSubViewStorage(subView: ProfileSubView | null): void {
  if (typeof window === "undefined") return;

  if (subView) {
    window.localStorage.setItem(PROFILE_SUBVIEW_STORAGE_KEY, JSON.stringify(subView));
  } else {
    window.localStorage.removeItem(PROFILE_SUBVIEW_STORAGE_KEY);
  }
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

export function toHomeProfile(baseProfile: HomeProfile, payload: ProfileDetailPayload): HomeProfile {
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

export async function loadHomeProfile(baseProfile: HomeProfile): Promise<ProfileLoadResult> {
  const session = getValidAuthSession();
  if (!session) {
    clearAuthSession();
    return {
      profile: baseProfile,
      shouldRedirectToLogin: true,
    };
  }

  try {
    const payload = await getProfileDetailFromApi();
    return {
      profile: toHomeProfile(baseProfile, payload),
      shouldRedirectToLogin: false,
      backendUserRole: normalizeBackendUserRole(payload.user_role),
    };
  } catch (error) {
    if (getProfileServiceErrorStatus(error) === 401) {
      clearAuthSession();
      return {
        profile: baseProfile,
        shouldRedirectToLogin: true,
      };
    }

    return {
      profile: baseProfile,
      shouldRedirectToLogin: false,
      errorMessage: getProfileServiceErrorMessage(error, "Gagal mengambil profile."),
    };
  }
}

export function clearProfileSession(): void {
  clearAuthSession();
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
};
