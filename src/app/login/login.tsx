import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SwitchTheme } from "../global.theme";
import Logo from "../../assets/Figma/QQMLogo.png";
import BorderGlow from "../../Animation/BorderGlow";
import { getLoginFormErrorMessage, loginFields, loginSocialItems, submitLogin, type AuthSocialItem } from "./login";

function SocialButton({ icon, label, className = "" }: AuthSocialItem) {
  return (
    <div className="auth-social-item min-w-0">
      <button
        type="button"
        aria-label={label}
        className={`btn btn-circle h-12 min-h-12 w-12 border-base-300 bg-base-100 shadow-none hover:bg-base-200 ${className}`}
      >
        <img src={icon} className="h-5 w-5" alt={label} />
      </button>
      <span className="auth-social-label">{label}</span>
    </div>
  );
}

const LoginForm = ({ onLogin }: { onLogin: (identity: string, password: string) => Promise<void> }) => {
  const location = useLocation();
  const flashMessage =
    location.state &&
    typeof location.state === "object" &&
    "flashMessage" in location.state &&
    typeof (location.state as { flashMessage?: unknown }).flashMessage === "string"
      ? (location.state as { flashMessage: string }).flashMessage
      : null;

  const identityHint =
    location.state &&
    typeof location.state === "object" &&
    "identityHint" in location.state &&
    typeof (location.state as { identityHint?: unknown }).identityHint === "string"
      ? (location.state as { identityHint: string }).identityHint
      : "";

  const [identity, setIdentity] = useState(identityHint);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const showFlashMessage = useMemo(() => flashMessage && !formError, [flashMessage, formError]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!identity.trim() || !password.trim()) {
      setFormError("Identity sama password wajib diisi dulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(identity, password);
    } catch (error) {
      setFormError(getLoginFormErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-card w-full max-w-full p-6 sm:p-10" onSubmit={handleSubmit}>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="auth-logo-shell mb-4">
          <img src={Logo} alt="QQM Logo" className="size-[92px] object-contain sm:size-[100px]" />
        </div>
        <h1 className="auth-section-title text-base-content">Login</h1>
      </div>

      {showFlashMessage ? (
        <div className="alert alert-success mb-4 py-2 text-sm">
          <span>{flashMessage}</span>
        </div>
      ) : null}

      <div className="space-y-4">
        {loginFields.map((field) => (
          <label key={field.name} className="form-control gap-2">
            <span className="text-xs font-medium text-base-content/80">{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={field.name === "identity" ? identity : password}
              onChange={(event) => {
                const { value } = event.target;
                if (field.name === "identity") {
                  setIdentity(value);
                  return;
                }

                setPassword(value);
              }}
              className="auth-field input input-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-[#6600FF]"
            />
          </label>
        ))}
      </div>

      {formError ? (
        <div className="alert alert-error mt-4 py-2 text-sm">
          <span>{formError}</span>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="flex min-w-0 cursor-pointer items-center gap-2 text-base-content/80">
          <input type="checkbox" className="checkbox checkbox-xs rounded-[4px] border-base-300" defaultChecked />
          <span className="label-text text-base-content/80">Simpan Informasi</span>
        </label>
        <button type="button" className="shrink-0 font-medium text-[#4C8DFF] transition-opacity hover:opacity-80">
          Lupa Password?
        </button>
      </div>

      <button
        type="submit"
        className="auth-submit btn mt-4 w-full border-none bg-primary text-primary-content shadow-none transition-transform hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Masuk..." : "Login"}
      </button>

      <div className="mt-12 text-center">
        <div className="text-xs font-bold text-base-content/85">Lanjutkan Menggunakan</div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-8">
          {loginSocialItems.map((item) => (
            <SocialButton key={item.label} {...item} />
          ))}
        </div>
      </div>

      <p className="mt-16 text-center text-xs text-base-content/80">
        Belum punya akun?{" "}
        <Link to="/register" className="font-medium text-[#4C8DFF] hover:underline">
          Registrasi
        </Link>
      </p>
    </form>
  );
};

function LoginComponent() {
  const navigate = useNavigate();

  async function handleLogin(identity: string, password: string) {
    await submitLogin(identity, password);
    navigate("/home", { replace: true });
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-base-100 px-3 py-4 font-sans text-base-content sm:px-4">
      <div className="mx-auto flex w-full max-w-5xl justify-end">
        <SwitchTheme />
      </div>

      <div className="auth-stage mx-auto flex w-full max-w-5xl items-center justify-center overflow-x-hidden">
        <BorderGlow
          className="w-full max-w-[406px] overflow-hidden"
          edgeSensitivity={30}
          coneSpread={14}
          glowColor="270 95 70"
          backgroundColor="var(--color-base-100)"
          borderRadius={28}
          glowRadius={80}
          glowIntensity={1.1}
          animated={true}
          colors={["#6600FF", "#A046FF", "#38BDF8"]}
          fillOpacity={0.14}
        >
          <LoginForm onLogin={handleLogin} />
        </BorderGlow>
      </div>
    </div>
  );
}

export default LoginComponent;
