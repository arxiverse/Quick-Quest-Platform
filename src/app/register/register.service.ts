import GlobalEndpoint, { postJson, ApiRequestError } from "../global.service";
import { DUMMY_OTP_CODE, type RegisterFieldName, type RegisterFlowStepKey, type RegisterFormState } from "./register";

export type RegisterStepErrors = Partial<Record<RegisterFieldName, string>>;

export type RegisterRequestPayload = Omit<RegisterFormState, "otp_code">;

export type RegisterResponse = {
  success: boolean;
  message: string;
  data?: {
    local?: {
      user_id: string;
      auth_id: string;
    };
    cloud?: unknown;
  };
};

const STEP_FIELDS: Record<RegisterFlowStepKey, RegisterFieldName[]> = {
  account: ["username", "email", "phone"],
  otp: ["otp_code"],
  identity: ["fullname", "birthdate", "province", "city", "district", "sub_district", "full_address"],
  skills: ["tags_skills"],
  password: ["password"],
};

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value: string): boolean {
  return /^\+?[0-9]{8,16}$/.test(value);
}

function validateOtp(value: string): boolean {
  return /^\d{6}$/.test(value);
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
      continue;
    }
  }

  return errors;
}

export function hasRegisterStepErrors(errors: RegisterStepErrors): boolean {
  return Object.keys(errors).length > 0;
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

export async function registerUser(form: RegisterFormState): Promise<RegisterResponse> {
  const payload = normalizeRegisterPayload(form);
  const endpoints = GlobalEndpoint();

  try {
    return await postJson<RegisterRequestPayload, RegisterResponse>(endpoints.auth.register, payload);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    throw new ApiRequestError("Register gagal dikirim ke backend.");
  }
}
