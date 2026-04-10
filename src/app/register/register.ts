import GoogleLogo from "../../assets/svg/google-logo.svg";
import LinkedinLogo from "../../assets/svg/linkedin-logo.svg";

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

export const DUMMY_OTP_CODE = "123456";

export const registerSocialItems: AuthSocialItem[] = [
  {
    icon: GoogleLogo,
    label: "Google",
  },
  {
    icon: LinkedinLogo,
    label: "Linked In",
    className: "hover:bg-blue-500/10",
  },
];

export const initialRegisterFormState: RegisterFormState = {
  username: "",
  email: "",
  phone: "",
  otp_code: "",
  fullname: "",
  birthdate: "",
  province: "",
  city: "",
  district: "",
  sub_district: "",
  full_address: "",
  tags_skills: "",
  password: "",
};

export const registerTimelineSteps: RegisterStep[] = [
  {
    key: "account",
    title: "Register",
    headline: "Bikin akun Quick Quest dulu.",
    description: "Langkah awal buat ngedaftarin username, email, sama nomor HP aktif.",
    orderLabel: "1 / 5",
    fields: [
      { label: "Username", type: "text", name: "username", placeholder: "neiraverse" },
      { label: "Email", type: "email", name: "email", placeholder: "nama@email.com" },
      { label: "Nomor HP", type: "tel", name: "phone", placeholder: "081234567890" },
    ],
    nextLabel: "Verifikasi OTP",
  },
  {
    key: "otp",
    title: "OTP Verification",
    headline: "Masukin OTP dummy dulu buat ngelewatin verifikasi.",
    description: "Engine OTP belum nyala, jadi sementara kita pakai kode dummy 6 digit di frontend dulu.",
    orderLabel: "2 / 5",
    fields: [
      {
        label: "Kode OTP",
        type: "text",
        name: "otp_code",
        placeholder: "Masukin 6 digit kode OTP",
      },
    ],
    nextLabel: "Lanjut Identitas",
  },
  {
    key: "identity",
    title: "Identitas",
    headline: "Lengkapi data diri biar matching quest lebih akurat.",
    description: "Data wilayah dan alamat dipakai buat nentuin radius kerja dan distribusi task.",
    orderLabel: "3 / 5",
    fields: [
      { label: "Nama Lengkap", type: "text", name: "fullname", placeholder: "Neira Verse" },
      { label: "Tanggal Lahir", type: "date", name: "birthdate" },
      { label: "Provinsi", type: "text", name: "province", placeholder: "Jawa Barat" },
      { label: "Kota / Kabupaten", type: "text", name: "city", placeholder: "Bandung" },
      { label: "Kecamatan", type: "text", name: "district", placeholder: "Coblong" },
      { label: "Kelurahan / Desa", type: "text", name: "sub_district", placeholder: "Dago" },
      {
        label: "Alamat Lengkap",
        type: "text",
        name: "full_address",
        as: "textarea",
        rows: 3,
        placeholder: "Jl. Contoh No. 10, RT/RW, patokan rumah",
      },
    ],
    nextLabel: "Lanjut Skill",
  },
  {
    key: "skills",
    title: "Skill User",
    headline: "Kasih tahu skill yang kamu kuasai.",
    description: "Pisahin pakai koma biar backend gampang mapping ke kategori quest dan rank lokal.",
    orderLabel: "4 / 5",
    fields: [
      {
        label: "Tags Skill",
        type: "text",
        name: "tags_skills",
        as: "textarea",
        rows: 4,
        placeholder: "Cleaning, Display, Survey, Coding",
      },
    ],
    nextLabel: "Lanjut Password",
  },
  {
    key: "password",
    title: "Password",
    headline: "Kunci akunmu sebelum masuk ke sistem.",
    description: "Password minimal 8 karakter dan nanti bakal di-hash di backend, jadi di sini kita rapihin dulu inputnya.",
    orderLabel: "5 / 5",
    fields: [
      { label: "Password", type: "password", name: "password", placeholder: "Minimal 8 karakter" },
    ],
    nextLabel: "Buat Akun",
  },
];

export const registerStepFlow: RegisterFlowStepKey[] = ["account", "otp", "identity", "skills", "password"];

export function getRegisterStep(stepKey: RegisterStepKey): RegisterStep {
  const step = registerTimelineSteps.find((item) => item.key === stepKey);
  if (!step) {
    throw new Error(`Step ${stepKey} belum terdaftar.`);
  }

  return step;
}
