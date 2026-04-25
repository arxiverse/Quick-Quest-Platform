import { useRoute } from "../../../route.context";
import { useAuth } from "../../../auth.context";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Logo from "../../../../assets/Figma/QQMLogo.png";
import { cn, Surface } from "../../home.ui";
import {
  economicImpactItems,
  formatReliabilityValue,
  growthPathItems,
  initialProfileSettingState,
  loadHomeProfile,
  loadProfileDetail,
  loadProfileVerificationState,
  portfolioContracts,
  ppIntelligenceRows,
  profileBadges,
  profileSettingTabOrder,
  profileSettings,
  profileSkillBreakdown,
  profileStats,
  profileViewText,
  reliabilityTrends,
  resolveInitialProfileVerificationState,
  resolveContractStatusClass,
  resolveInitialProfileSubView,
  resolveProfileStorageScope,
  resolveLevelClass,
  resolveReliabilityTrendClass,
  resolveVerificationStatusPresentation,
  syncProfileVerificationStorage,
  syncProfileVerificationWithBackend,
  syncProfileSubViewStorage,
  type ProfileProps,
  type ProfileSubView,
  type ProfileVerificationState,
  type ProfileStatItem,
  type SettingTabKey,
} from "./profile";
import type { HomeProfile } from "../../home";
import { EditProfile } from "./page/edit-profile";
import { KycSettlement } from "./page/kyc-settlement";
import { VerificationCenter } from "./page/verification-center";
import { useAnimationTheme } from "../../../global.theme";
import Aurora from "../../../../Animation/Aurora";
import BorderGlow from "../../../../Animation/BorderGlow";
import LightPillar from "../../../../Animation/LightPillar";
import { useRole } from "../../role.context";

function IdentityIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mt-0.5 inline-flex size-5 items-center justify-center text-base-content">
      {children}
    </span>
  );
}

function UserIdentityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="size-[18px]"
    >
      <circle cx="12" cy="7.5" r="3.2" />
      <path
        d="M6 18.5C7.08 15.97 9.03 14.8 12 14.8C14.97 14.8 16.92 15.97 18 18.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIdentityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="size-[18px]"
    >
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M5 8L12 13L19 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIdentityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="size-[18px]"
    >
      <path
        d="M7 4.5H10L11.4 8.1L9.8 9.7C10.61 11.33 11.67 12.39 13.3 13.2L14.9 11.6L18.5 13V16C18.5 17.1 17.6 18 16.5 18H16C10.75 18 6.5 13.75 6.5 8.5V8C6.5 6.9 5.6 4.5 7 4.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIdentityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="size-[18px]"
    >
      <path
        d="M12 20C15.5 15.6 17.25 12.52 17.25 9.75C17.25 6.57 14.68 4 11.5 4C8.32 4 5.75 6.57 5.75 9.75C5.75 12.52 7.5 15.6 11 20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11.5" cy="9.5" r="1.8" />
    </svg>
  );
}
function StatIcon({
  iconKey,
  className = "",
}: {
  iconKey: ProfileStatItem["iconKey"];
  className?: string;
}) {
  if (iconKey === "quest") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("size-5", className)}
      >
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 4.5H15" strokeLinecap="round" />
        <path d="M8 11H16" strokeLinecap="round" />
        <path d="M8 15H13" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconKey === "pp") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("size-5", className)}
      >
        <path d="M12 5V19" strokeLinecap="round" />
        <path
          d="M6.5 10.5L12 5L17.5 10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 18L12 14L16 18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (iconKey === "rank") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("size-5", className)}
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5V16.5" strokeLinecap="round" />
        <path d="M7.5 12H16.5" strokeLinecap="round" />
        <path d="M8.8 8.8L15.2 15.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconKey === "nation") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("size-5", className)}
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12H20" strokeLinecap="round" />
        <path
          d="M12 4C14.35 6.1 15.67 8.75 15.67 12C15.67 15.25 14.35 17.9 12 20"
          strokeLinecap="round"
        />
        <path
          d="M12 4C9.65 6.1 8.33 8.75 8.33 12C8.33 15.25 9.65 17.9 12 20"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (iconKey === "accuracy") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        className={cn("size-5", className)}
      >
        <path
          d="M13 3L6.5 13H11L10 21L17.5 10.5H13.2L13 3Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("size-5", className)}
    >
      <path d="M9 16.5H15" strokeLinecap="round" />
      <path d="M8 8.5H16" strokeLinecap="round" />
      <path d="M8 12.5H16" strokeLinecap="round" />
      <rect x="5" y="4.5" width="14" height="15" rx="3" />
    </svg>
  );
}

function ProfileIdentityRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-base-content sm:text-base">
      <IdentityIcon>{icon}</IdentityIcon>
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

export function ProfileContent({ profile }: { profile: HomeProfile }) {
  const { navigate } = useRoute();
  const { logoutClient, userProfile } = useAuth();
  const storageScope = resolveProfileStorageScope(userProfile);
  const [resolvedProfile, setResolvedProfile] = useState<HomeProfile>(profile);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileAuthorization, setProfileAuthorization] = useState<string>(
    userProfile?.authorization?.trim() || "user",
  );
  const [activeSettingTab, setActiveSettingTab] =
    useState<SettingTabKey>("Umum");
  const [settingState, setSettingState] = useState<Record<string, boolean>>(
    initialProfileSettingState,
  );
  const [subView, setSubView] = useState<ProfileSubView | null>(
    () => resolveInitialProfileSubView(storageScope),
  );
  const [verificationState, setVerificationState] =
    useState<ProfileVerificationState>(() =>
      resolveInitialProfileVerificationState(
        storageScope,
        profile,
        "user_runner",
      ),
    );
  const { animationsEnabled, setAnimationsEnabled } = useAnimationTheme();
  const { isGiverVerified, syncUserRoleFromBackend } = useRole();

  useEffect(() => {
    let isCancelled = false;

    async function loadProfile() {
      const result = loadHomeProfile(profile, userProfile);
      if (isCancelled) return;

      if (result.shouldRedirectToLogin) {
        logoutClient();
        navigate("login");
        return;
      }

      if (result.backendUserRole) {
        syncUserRoleFromBackend(result.backendUserRole);
        setVerificationState((currentState) =>
          syncProfileVerificationWithBackend(
            currentState,
            result.profile,
            result.backendUserRole ?? "user_runner",
          ),
        );
      }
      setResolvedProfile(result.profile);
      setProfileError(result.errorMessage ?? null);
      setProfileAuthorization(result.authorization ?? "user");

      try {
        const detailResult = await loadProfileDetail(result.profile);
        if (isCancelled) return;

        if (detailResult.backendUserRole) {
          syncUserRoleFromBackend(detailResult.backendUserRole);
          setVerificationState((currentState) =>
            syncProfileVerificationWithBackend(
              currentState,
              detailResult.profile,
              detailResult.backendUserRole ?? "user_runner",
            ),
          );
        }

        setResolvedProfile(detailResult.profile);
        setProfileAuthorization(detailResult.authorization ?? "user");
        setProfileError(null);

        try {
          const verificationResult = await loadProfileVerificationState(
            detailResult.profile,
          );
          if (isCancelled) return;
          setVerificationState(verificationResult);
        } catch {
          if (isCancelled) return;
          // Biarkan fallback ke state scoped lokal jika summary verification backend belum bisa dimuat.
        }
      } catch (error) {
        if (isCancelled) return;

        const status =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error &&
          typeof (error as { statusCode?: unknown }).statusCode === "number"
            ? ((error as { statusCode: number }).statusCode)
            : null;

        if (status === 401) {
          await logoutClient();
          navigate("login");
          return;
        }

        setProfileError("Data profile backend belum bisa dimuat penuh, jadi sementara pakai snapshot session.");
      }
    }

    void loadProfile();
    return () => {
      isCancelled = true;
    };
  }, [navigate, profile, storageScope, syncUserRoleFromBackend, userProfile]);

  useEffect(() => {
    setSubView(resolveInitialProfileSubView(storageScope));
  }, [storageScope]);

  useEffect(() => {
    syncProfileSubViewStorage(storageScope, subView);
  }, [storageScope, subView]);

  useEffect(() => {
    setVerificationState(
      resolveInitialProfileVerificationState(
        storageScope,
        resolvedProfile,
        isGiverVerified ? "user_unlocked" : "user_runner",
      ),
    );
  }, [isGiverVerified, resolvedProfile, storageScope]);

  useEffect(() => {
    syncProfileVerificationStorage(storageScope, verificationState);
  }, [storageScope, verificationState]);

  const maxPpResult = useMemo(
    () => Math.max(...ppIntelligenceRows.map((row) => row.result), 1),
    [],
  );
  const effectiveSettingState = useMemo<Record<string, boolean>>(
    () => ({
      ...settingState,
      "personal-dynamic-animation": animationsEnabled,
    }),
    [animationsEnabled, settingState],
  );
  const activeSettings = profileSettings[activeSettingTab];
  const activeEnabledCount = activeSettings.filter(
    (item) => effectiveSettingState[item.id],
  ).length;
  const settingCompletion = Math.round(
    (activeEnabledCount / activeSettings.length) * 100,
  );
  const verificationPresentation =
    resolveVerificationStatusPresentation(verificationState);
  const canOpenAdminPanel = profileAuthorization.trim().toLowerCase() !== "user";

  function handleAdminSideEntry() {
    if (typeof window === "undefined" || !canOpenAdminPanel) {
      return;
    }

    window.dispatchEvent(new Event("qqm-enter-admin-panel"));
  }

  function toggleSetting(itemId: string) {
    if (itemId === "personal-dynamic-animation") {
      setAnimationsEnabled(!effectiveSettingState[itemId]);
    }
    setSettingState((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }

  if (subView?.view === "EditProfile") {
    return <EditProfile onBack={() => setSubView(null)} />;
  }

  if (subView?.view === "KycSettlement") {
    return <KycSettlement onBack={() => setSubView(null)} />;
  }

  if (subView?.view === "VerificationCenter") {
    return (
      <VerificationCenter
        profile={resolvedProfile}
        verificationState={verificationState}
        onChange={setVerificationState}
        onBack={() => setSubView(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <Surface className="p-4 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[12px] bg-base-200 sm:size-[86px]">
                <img
                  src={Logo}
                  alt="QQM"
                  className="size-[52px] object-contain sm:size-[68px]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">
                  {profileViewText.identityEyebrow}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-base-content sm:text-[2rem]">
                  {resolvedProfile.name}
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  {resolvedProfile.role}
                </p>
                <div className="mt-3 space-y-2">
                  <ProfileIdentityRow icon={<UserIdentityIcon />}>
                    {resolvedProfile.name}
                  </ProfileIdentityRow>
                  <ProfileIdentityRow icon={<MailIdentityIcon />}>
                    {resolvedProfile.email}
                  </ProfileIdentityRow>
                  <ProfileIdentityRow icon={<PhoneIdentityIcon />}>
                    {resolvedProfile.phone}
                  </ProfileIdentityRow>
                  <ProfileIdentityRow icon={<LocationIdentityIcon />}>
                    {resolvedProfile.address}
                  </ProfileIdentityRow>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 lg:min-w-44">
              {canOpenAdminPanel ? (
                <button
                  type="button"
                  onClick={handleAdminSideEntry}
                  className="btn h-10 min-h-10 rounded-[8px] border-none bg-neutral px-5 text-sm text-neutral-content shadow-none hover:opacity-90 sm:h-11 sm:min-h-11 sm:px-6"
                >
                  Admin Side
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setSubView({ view: "EditProfile" })}
                className="btn h-10 min-h-10 rounded-[8px] border-none bg-primary px-5 text-sm text-primary-content shadow-none hover:opacity-90 sm:h-11 sm:min-h-11 sm:px-6"
              >
                {profileViewText.editButtonLabel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logoutClient();
                  navigate("login");
                }}
                className="btn h-10 min-h-10 rounded-[8px] border-none bg-error px-5 text-sm text-error-content shadow-none hover:opacity-90 sm:h-11 sm:min-h-11 sm:px-6"
              >
                {profileViewText.logoutButtonLabel}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[12px] border border-base-300/70 bg-base-100 p-4">
            {animationsEnabled && (
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <Aurora blend={0.6} amplitude={1.0} speed={0.4} />
              </div>
            )}
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
                {profileViewText.verificationEyebrow}
              </p>
              <h3 className="mt-1 text-lg font-bold text-base-content">
                {verificationPresentation.headline}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-[999px] px-2.5 py-1 text-[11px] font-bold ${verificationPresentation.pillClassName}`}
                >
                  {verificationPresentation.pillLabel}
                </span>
                <span className="rounded-[999px] bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-bold text-[#1D4ED8]">
                  Stage {verificationState.stage}
                </span>
                <span className="rounded-[999px] bg-[#E9D5FF] px-2.5 py-1 text-[11px] font-bold text-[#6D28D9]">
                  {verificationState.trustTier}
                </span>
                <span className="rounded-[999px] bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-bold text-[#92400E]">
                  {verificationState.riskBand}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-base-content/65">
                {verificationState.reviewerNote}
              </p>
              <p className="mt-2 text-xs text-base-content/65">
                {profileViewText.verificationLastReviewPrefix}{" "}
                {verificationState.updatedAtLabel}
              </p>
              <button
                type="button"
                onClick={() => setSubView({ view: "VerificationCenter" })}
                className="btn mt-4 h-10 min-h-10 rounded-[10px] border-none bg-primary px-4 text-sm text-primary-content shadow-none hover:opacity-90"
              >
                {verificationPresentation.actionLabel}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[12px] border border-base-300/70 bg-base-100 p-4">
            {animationsEnabled && (
              <div className="absolute top-0 inset-x-0 bottom-0 pointer-events-none opacity-60 mix-blend-screen overflow-hidden">
                <LightPillar />
              </div>
            )}
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
                {profileViewText.trophyEyebrow}
              </p>
              <h3 className="mt-1 text-lg font-bold text-base-content">
                {profileViewText.trophyTitle}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {profileBadges.map((badge) => {
                  const InnerBadge = () => (
                    <div className="flex flex-col items-center gap-2 p-3 text-center transition-all w-full h-full">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full text-lg shadow-sm border",
                          badge.type === "mythic"
                            ? "bg-linear-to-tr from-[#A046FF] to-[#38BDF8] text-white border-transparent"
                            : badge.type === "gold"
                              ? "bg-linear-to-tr from-[#F59E0B] to-[#FBBF24] text-white border-transparent"
                              : badge.type === "silver"
                                ? "bg-linear-to-tr from-[#94A3B8] to-[#CBD5E1] text-white border-transparent"
                                : "bg-[#B45309] text-white border-transparent",
                        )}
                      >
                        {badge.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-base-content">
                          {badge.label}
                        </p>
                        <p className="mt-0.5 text-[9px] text-base-content/65">
                          {badge.desc}
                        </p>
                      </div>
                    </div>
                  );

                  const glowColor =
                    badge.type === "mythic"
                      ? "160 70 255"
                      : badge.type === "gold"
                        ? "245 158 11"
                        : badge.type === "silver"
                          ? "148 163 184"
                          : "180 83 9";

                  return animationsEnabled ? (
                    <BorderGlow
                      key={badge.id}
                      className="group relative rounded-[10px] bg-base-200/50 hover:bg-base-200/80 hover:-translate-y-0.5 transition-transform w-full"
                      edgeSensitivity={15}
                      glowColor={glowColor}
                      glowRadius={15}
                      glowIntensity={0.8}
                      animated={false}
                    >
                      <div className="relative z-10 w-full h-full border border-base-200/50 rounded-[10px]">
                        <InnerBadge />
                      </div>
                    </BorderGlow>
                  ) : (
                    <div
                      key={badge.id}
                      className="group relative rounded-[10px] border border-base-300/50 bg-base-200/50 hover:bg-base-200 w-full hover:-translate-y-0.5 transition-transform"
                    >
                      <InnerBadge />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {profileError ? (
            <div className="rounded-[8px] border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">
              {profileError}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {profileStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 rounded-[10px] border border-base-300/60 bg-base-100 px-3 py-2.5"
              >
                <StatIcon iconKey={stat.iconKey} className={stat.toneClass} />
                <p className="text-sm font-semibold text-base-content sm:text-base">
                  <span>{stat.label}</span>
                  <span className="mx-1">:</span>
                  <span>{stat.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </Surface>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
            {profileViewText.ppIntelligenceEyebrow}
          </p>
          <h3 className="mt-1 text-lg font-bold text-base-content">
            {profileViewText.ppIntelligenceTitle}
          </h3>
          <p className="mt-1 text-xs text-base-content/65">
            {profileViewText.ppFormulaLabel}
          </p>
          <div className="mt-3 space-y-2.5">
            {ppIntelligenceRows.map((row) => (
              <div
                key={row.skill}
                className="rounded-[10px] border border-base-300/60 bg-base-100 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-base-content">
                    {row.skill}
                  </p>
                  <span className="rounded-[8px] bg-[#DBEAFE] px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                    {row.growth}
                  </span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">
                  {row.rating.toFixed(1)} x {row.difficulty.toFixed(2)} x{" "}
                  {row.valueFactor.toFixed(2)} x {row.decay.toFixed(2)}
                </p>
                <div className="mt-2 h-2 rounded-full bg-base-200">
                  <div
                    className="h-2 rounded-full bg-[#6B21FF]"
                    style={{
                      width: `${Math.round((row.result / maxPpResult) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] font-semibold text-base-content/70">
                  PP Result Score: {row.result.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
            {profileViewText.growthPathEyebrow}
          </p>
          <h3 className="mt-1 text-lg font-bold text-base-content">
            {profileViewText.growthPathTitle}
          </h3>
          <div className="mt-3 space-y-2.5">
            {growthPathItems.map((item) => (
              <div
                key={item.skill}
                className="rounded-[10px] border border-base-300/60 bg-base-100 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-base-content">
                    {item.skill}
                  </p>
                  <span
                    className={cn(
                      "rounded-[8px] px-2 py-0.5 text-[11px] font-semibold",
                      resolveLevelClass(item.currentLevel),
                    )}
                  >
                    {item.currentLevel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">
                  {profileViewText.growthPathTargetPrefix} {item.nextLevel}
                </p>
                <div className="mt-2 h-2 rounded-full bg-base-200">
                  <div
                    className="h-2 rounded-full bg-[#2563EB]"
                    style={{ width: `${item.progressToNext}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] font-semibold text-base-content/70">
                  {item.progressToNext}% menuju {item.nextLevel}
                </p>
                <p className="mt-1 text-xs text-base-content/65">
                  {item.requirement}
                </p>
                <p className="mt-1 text-xs text-base-content/55">{item.note}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
            {profileViewText.portfolioEyebrow}
          </p>
          <h3 className="mt-1 text-lg font-bold text-base-content">
            {profileViewText.portfolioTitle}
          </h3>
          <div className="mt-3 space-y-2.5">
            {portfolioContracts.map((item) => (
              <div
                key={item.id}
                className="rounded-[10px] border border-base-300/60 bg-base-100 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">
                      {item.id}
                    </p>
                    <p className="text-sm font-bold text-base-content">
                      {item.title}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-[8px] px-2 py-0.5 text-[11px] font-semibold",
                      resolveContractStatusClass(item.status),
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">
                  {item.mode} • {item.role}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-[8px] bg-base-200 px-2.5 py-1.5 font-semibold text-base-content/75">
                    {profileViewText.portfolioValuePrefix} {item.valueDelivered}
                  </div>
                  <div className="rounded-[8px] bg-base-200 px-2.5 py-1.5 font-semibold text-base-content/75">
                    {profileViewText.portfolioRepeatPrefix}{" "}
                    {item.repeatGiverRate}
                  </div>
                </div>
                <p className="mt-2 text-xs text-base-content/65">
                  {item.impact}
                </p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
            {profileViewText.reliabilityEyebrow}
          </p>
          <h3 className="mt-1 text-lg font-bold text-base-content">
            {profileViewText.reliabilityTitle}
          </h3>
          <div className="mt-3 space-y-2.5">
            {reliabilityTrends.map((item) => {
              const isGood =
                item.preferred === "high"
                  ? item.d7 >= item.d30
                  : item.d7 <= item.d30;
              const trendLabel = isGood
                ? profileViewText.reliabilityImproveLabel
                : profileViewText.reliabilityAttentionLabel;
              return (
                <div
                  key={item.metric}
                  className="rounded-[10px] border border-base-300/60 bg-base-100 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-base-content">
                      {item.metric}
                    </p>
                    <span
                      className={cn(
                        "rounded-[8px] px-2 py-0.5 text-[11px] font-semibold",
                        resolveReliabilityTrendClass(isGood),
                      )}
                    >
                      {trendLabel}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-[8px] bg-base-200 px-2 py-1.5 font-semibold text-base-content/75">
                      7D {formatReliabilityValue(item.d7, item.unit)}
                    </div>
                    <div className="rounded-[8px] bg-base-200 px-2 py-1.5 font-semibold text-base-content/75">
                      30D {formatReliabilityValue(item.d30, item.unit)}
                    </div>
                    <div className="rounded-[8px] bg-base-200 px-2 py-1.5 font-semibold text-base-content/75">
                      Target {formatReliabilityValue(item.target, item.unit)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
              {profileViewText.economicEyebrow}
            </p>
            <button
              onClick={() => setSubView({ view: "KycSettlement" })}
              type="button"
              className="btn btn-xs h-7 min-h-7 border-none bg-success px-4 text-[10px] font-bold text-white shadow hover:opacity-90"
            >
              {profileViewText.withdrawBalanceLabel}
            </button>
          </div>
          <h3 className="mt-1 text-lg font-bold text-base-content">
            {profileViewText.economicTitle}
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {economicImpactItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[10px] border border-base-300/70 bg-base-100 p-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-bold text-base-content">
                  {item.value}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold text-black",
                    item.tone,
                  )}
                >
                  {item.hint}
                </span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
                {profileViewText.settingsEyebrow}
              </p>
              <h3 className="mt-1 text-lg font-bold text-base-content">
                {profileViewText.settingsTitle}
              </h3>
            </div>
            <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">
              {profileViewText.settingsActivationPrefix} {settingCompletion}%
            </span>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {profileSettingTabOrder.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSettingTab(tab)}
                className={cn(
                  "btn h-8 min-h-8 rounded-[999px] border-none px-3 text-xs shadow-none",
                  activeSettingTab === tab
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content/75 hover:bg-base-300",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {activeSettings.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm mt-0.5"
                  checked={effectiveSettingState[item.id]}
                  onChange={() => toggleSetting(item.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    {item.label}{" "}
                    {item.critical ? (
                      <span className="rounded-[6px] bg-[#FEE2E2] px-1.5 py-0.5 text-[10px] font-bold text-[#991B1B]">
                        {profileViewText.settingsCriticalLabel}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-base-content/65">
                    {item.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </Surface>
      </div>
      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
          {profileViewText.ppBreakdownEyebrow}
        </p>
        <h3 className="mt-1 text-lg font-bold text-base-content">
          {profileViewText.ppBreakdownTitle}
        </h3>
        <div className="mt-3 grid gap-3">
          {profileSkillBreakdown.map((item) => (
            <div
              key={item.skill}
              className="rounded-[10px] border border-base-300/60 bg-base-100 px-3 py-2.5"
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-base-content">
                  {item.skill}
                </p>
                <span className="text-xs font-semibold text-base-content/65">
                  {item.pp}
                </span>
              </div>
              <div className="h-2 rounded-full bg-base-200">
                <div
                  className={cn("h-2 rounded-full", item.toneClass)}
                  style={{ width: `${item.share}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-base-content/65">
                <span>Kontribusi {item.share}%</span>
                <span>{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function ProfileComponent({
  profile,
  compact = false,
  className = "",
  showMeta = true,
}: ProfileProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[12px] border border-base-300/70 bg-base-100/95 shadow-[0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur",
        compact ? "px-3 py-2" : "px-3 py-2.5 sm:px-4 sm:py-3",
        className,
      )}
    >
      <div className="relative shrink-0">
        <div className={cn("avatar", compact && "block")}>
          <div
            className={cn(
              "rounded-full border border-base-300/70 bg-base-300 shadow-sm",
              compact ? "size-10" : "size-11 sm:size-[52px]",
            )}
          >
            <img src={Logo} alt="QQM" className="object-cover p-1.5" />
          </div>
        </div>
        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 bg-success" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-bold text-base-content",
            compact ? "text-sm" : "text-sm sm:text-base",
          )}
        >
          {profile.name}
        </p>
        {showMeta && (
          <p
            className={cn(
              "truncate font-medium text-base-content/60",
              compact ? "text-[11px]" : "text-xs sm:text-sm",
            )}
          >
            {profile.role} • {profile.location}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileComponent;
