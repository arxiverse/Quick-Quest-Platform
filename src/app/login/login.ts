import { useMemo, useState, type FormEvent } from "react";
import {
  getLoginServiceErrorMessage,
  loginFieldsSeed,
  loginSocialItemsSeed,
  loginViewCopySeed,
  loginWithCredentials,
  mapLoginResponseToRoleInitPayload,
  type LoginViewCopy,
} from "./login.service";
import type { RoleInitPayload } from "../home/role.service";
import { persistAccessToken } from "../global.service";

export type AuthSocialItem = {
  icon: string;
  label: string;
  className?: string;
};

export type LoginField = {
  label: string;
  type: "text" | "password";
  name: string;
};

export type LoginViewText = LoginViewCopy;

export type LoginRouteState = {
  flashMessage: string | null;
  identityHint: string;
};

type UseLoginFormVMParams = {
  routeState: unknown;
  onSubmitLogin: (identity: string, password: string) => Promise<void>;
};

type LoginFormVM = {
  identity: string;
  password: string;
  isSubmitting: boolean;
  formError: string | null;
  showFlashMessage: boolean;
  flashMessage: string | null;
  setIdentity: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export const loginFields: LoginField[] = loginFieldsSeed;
export const loginSocialItems: AuthSocialItem[] = loginSocialItemsSeed;
export const loginViewText: LoginViewText = loginViewCopySeed;

export function resolveLoginRouteState(routeState: unknown): LoginRouteState {
  const state = routeState && typeof routeState === "object" ? routeState as Record<string, unknown> : null;

  const flashMessage = state && typeof state.flashMessage === "string" ? state.flashMessage : null;
  const identityHint = state && typeof state.identityHint === "string" ? state.identityHint : "";

  return {
    flashMessage,
    identityHint,
  };
}

export function useLoginFormVM({ routeState, onSubmitLogin }: UseLoginFormVMParams): LoginFormVM {
  const routePayload = resolveLoginRouteState(routeState);

  const [identity, setIdentityState] = useState(routePayload.identityHint);
  const [password, setPasswordState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const showFlashMessage = useMemo(() => Boolean(routePayload.flashMessage) && !formError, [routePayload.flashMessage, formError]);

  function setIdentity(value: string) {
    setIdentityState(value);
    if (formError) {
      setFormError(null);
    }
  }

  function setPassword(value: string) {
    setPasswordState(value);
    if (formError) {
      setFormError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!identity.trim() || !password.trim()) {
      setFormError("Identity sama password wajib diisi dulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitLogin(identity, password);
    } catch (error) {
      setFormError(getLoginFormErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    identity,
    password,
    isSubmitting,
    formError,
    showFlashMessage,
    flashMessage: routePayload.flashMessage,
    setIdentity,
    setPassword,
    handleSubmit,
  };
}

export async function submitLogin(identity: string, password: string): Promise<RoleInitPayload> {
  const response = await loginWithCredentials(identity, password);
  persistAccessToken(response.data?.session?.accessToken);
  return mapLoginResponseToRoleInitPayload(response);

  // Backend tetap jadi source of truth via cookie, tapi FE simpan access token
  // di sessionStorage sebagai fallback bearer untuk dev/browser edge cases.
}

export function getLoginFormErrorMessage(error: unknown): string {
  return getLoginServiceErrorMessage(error, "Login gagal diproses, coba lagi bentar.");
}
