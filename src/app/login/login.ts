import GoogleLogo from "../../assets/svg/google-logo.svg";
import WhatsappLogo from "../../assets/svg/whatsapp-logo.svg";
import LinkedinLogo from "../../assets/svg/linkedin-logo.svg";

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

export const loginFields: LoginField[] = [
  {
    label: "Username / Email",
    type: "text",
    name: "identity",
  },
  {
    label: "Password",
    type: "password",
    name: "password",
  },
];

export const loginSocialItems: AuthSocialItem[] = [
  {
    icon: GoogleLogo,
    label: "Google",
  },
  {
    icon: WhatsappLogo,
    label: "HP",
    className: "hover:bg-green-500/10",
  },
  {
    icon: LinkedinLogo,
    label: "Linked In",
    className: "hover:bg-blue-500/10",
  },
];
