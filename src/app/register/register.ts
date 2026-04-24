import { useMemo, useState, type FormEvent } from "react";
import {
  REGISTER_DUMMY_OTP_CODE,
  getRegisterServiceErrorMessage,
  registerInitialFormStateSeed,
  registerSocialItemsSeed,
  registerStepFieldsSeed,
  registerStepFlowSeed,
  registerTimelineStepsSeed,
  registerViewCopySeed,
  registerUser,
  type RegisterRequestPayload,
  type RegisterResponse,
  type RegisterViewCopy,
} from "./register.service";

export type AuthSocialItem = {
  icon: string;
  label: string;
  className?: string;
};

export type RegisterFieldName =
  | "username"
  | "email"
  | "phone"
  | "otp_code"
  | "fullname"
  | "birthdate"
  | "province"
  | "city"
  | "district"
  | "sub_district"
  | "full_address"
  | "tags_skills"
  | "password";

export type RegisterStepKey = "account" | "otp" | "identity" | "skills" | "password";
export type RegisterFlowStepKey = RegisterStepKey;

export type RegisterField = {
  label: string;
  type: "text" | "email" | "tel" | "date" | "password";
  name: RegisterFieldName;
  as?: "input" | "textarea";
  placeholder?: string;
  rows?: number;
};

export type RegisterStep = {
  key: RegisterStepKey;
  title: string;
  headline: string;
  description: string;
  orderLabel: string;
  fields: RegisterField[];
  nextLabel?: string;
};

export type RegisterFormState = Record<RegisterFieldName, string>;

export type RegisterStepErrors = Partial<Record<RegisterFieldName, string>>;

export type RegisterTimelineItem = RegisterStep & {
  state: "active" | "done" | "upcoming";
};

export type RegisterViewText = RegisterViewCopy;

type UseRegisterFormVMParams = {
  onSubmitSuccess: (response: RegisterResponse, form: RegisterFormState) => void;
};

type RegisterFormVM = {
  formState: RegisterFormState;
  stepIndex: number;
  stepKey: RegisterFlowStepKey;
  step: RegisterStep;
  isLastStep: boolean;
  isSubmitting: boolean;
  requestMessage: string | null;
  stepErrors: RegisterStepErrors;
  timelineStatus: RegisterTimelineItem[];
  handleFieldChange: (name: RegisterFieldName, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

export const DUMMY_OTP_CODE = REGISTER_DUMMY_OTP_CODE;

const STEP_FIELDS: Record<RegisterFlowStepKey, RegisterFieldName[]> =
  registerStepFieldsSeed;

export const registerSocialItems: AuthSocialItem[] = registerSocialItemsSeed;

export const initialRegisterFormState: RegisterFormState =
  registerInitialFormStateSeed;

export const registerTimelineSteps: RegisterStep[] = registerTimelineStepsSeed;

export const registerStepFlow: RegisterFlowStepKey[] =
  registerStepFlowSeed as RegisterFlowStepKey[];

export const registerViewText: RegisterViewText = registerViewCopySeed;

export function buildRegisterTimelineStatus(step: RegisterStep, stepIndex: number): RegisterTimelineItem[] {
  return registerTimelineSteps.map((item, index) => {
    if (item.key === step.key) {
      return { ...item, state: "active" as const };
    }

    return {
      ...item,
      state: index < stepIndex ? "done" as const : "upcoming" as const,
    };
  });
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value: string): boolean {
  return /^\+?[0-9]{8,16}$/.test(value);
}

function validateOtp(value: string): boolean {
  return /^\d{6}$/.test(value);
}

export function getRegisterStep(stepKey: RegisterStepKey): RegisterStep {
  const step = registerTimelineSteps.find((item) => item.key === stepKey);
  if (!step) {
    throw new Error(`Step ${stepKey} belum terdaftar.`);
  }

  return step;
}

export function validateRegisterStep(step: RegisterFlowStepKey, form: RegisterFormState): RegisterStepErrors {
  const errors: RegisterStepErrors = {};

  for (const fieldName of STEP_FIELDS[step]) {
    const value = form[fieldName].trim();

    if (!value) {
      errors[fieldName] = "Field ini wajib diisi.";
      continue;
    }

    if (fieldName === "email" && !validateEmail(value)) {
      errors[fieldName] = "Format email belum valid.";
      continue;
    }

    if (fieldName === "phone" && !validatePhone(value)) {
      errors[fieldName] = "Nomor HP harus angka 8-16 digit.";
      continue;
    }

    if (fieldName === "otp_code") {
      if (!validateOtp(value)) {
        errors[fieldName] = "OTP harus 6 digit angka.";
        continue;
      }

      if (value !== DUMMY_OTP_CODE) {
        errors[fieldName] = "OTP dummy belum cocok. Pakai kode 123456 dulu ya.";
        continue;
      }
    }

    if (fieldName === "password" && value.length < 8) {
      errors[fieldName] = "Password minimal 8 karakter.";
    }
  }

  return errors;
}

export function hasRegisterStepErrors(errors: RegisterStepErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function useRegisterFormVM({ onSubmitSuccess }: UseRegisterFormVMParams): RegisterFormVM {
  const [formState, setFormState] = useState<RegisterFormState>(initialRegisterFormState);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepErrors, setStepErrors] = useState<RegisterStepErrors>({});
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepKey = registerStepFlow[stepIndex];
  const step = getRegisterStep(stepKey);
  const isLastStep = stepIndex === registerStepFlow.length - 1;

  const timelineStatus = useMemo(() => buildRegisterTimelineStatus(step, stepIndex), [step, stepIndex]);

  function handleFieldChange(name: RegisterFieldName, value: string) {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    setStepErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestMessage(null);

    const validationErrors = validateRegisterStep(stepKey, formState);
    if (hasRegisterStepErrors(validationErrors)) {
      setStepErrors(validationErrors);
      return;
    }

    setStepErrors({});

    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitRegisterForm(formState);
      onSubmitSuccess(response, formState);
    } catch (error) {
      setRequestMessage(getRegisterFormErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (stepIndex === 0 || isSubmitting) {
      return;
    }

    setRequestMessage(null);
    setStepErrors({});
    setStepIndex((prev) => prev - 1);
  }

  return {
    formState,
    stepIndex,
    stepKey,
    step,
    isLastStep,
    isSubmitting,
    requestMessage,
    stepErrors,
    timelineStatus,
    handleFieldChange,
    handleSubmit,
    handleBack,
  };
}

export function normalizeRegisterPayload(form: RegisterFormState): RegisterRequestPayload {
  return {
    username: form.username.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    fullname: form.fullname.trim(),
    birthdate: form.birthdate.trim(),
    province: form.province.trim(),
    city: form.city.trim(),
    district: form.district.trim(),
    sub_district: form.sub_district.trim(),
    full_address: form.full_address.trim(),
    tags_skills: form.tags_skills.trim(),
    password: form.password,
  };
}

export function getRegisterFormErrorMessage(error: unknown): string {
  return getRegisterServiceErrorMessage(error, "Register gagal diproses, coba ulang beberapa saat lagi.");
}

export async function submitRegisterForm(form: RegisterFormState): Promise<RegisterResponse> {
  return registerUser(normalizeRegisterPayload(form));
}
