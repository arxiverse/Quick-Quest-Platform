import GoogleLogo from "../../assets/svg/google-logo.svg";
import LinkedinLogo from "../../assets/svg/linkedin-logo.svg";

export type AuthSocialItem = {
  icon: string;
  label: string;
  className?: string;
};

export type RegisterField = {
  label: string;
  type: "text" | "email" | "tel";
  name: string;
};

export const registerFields: RegisterField[] = [
  {
    label: "Username",
    type: "text",
    name: "username",
  },
  {
    label: "Email",
    type: "email",
    name: "email",
  },
  {
    label: "Nomor HP",
    type: "tel",
    name: "phone",
  },
];

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
