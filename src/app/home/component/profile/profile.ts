import { clearAuthSession, getValidAuthSession } from "../../../auth.guard";
import type { HomeProfile } from "../../home";
import {
  getProfileDetailFromApi,
  getProfileServiceErrorMessage,
  getProfileServiceErrorStatus,
  type ProfileDetailPayload,
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

export type ProfileLoadResult = {
  profile: HomeProfile;
  shouldRedirectToLogin: boolean;
  errorMessage?: string;
};

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
  return {
    ...baseProfile,
    name: payload.fullname || baseProfile.name,
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
