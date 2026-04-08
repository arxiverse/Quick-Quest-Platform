import { Link } from "react-router-dom";
import { SwitchTheme } from "../global.theme";
import Logo from "../../assets/Figma/QQMLogo.png";
import BorderGlow from "../../Animation/BorderGlow";
import { loginFields, loginSocialItems, type AuthSocialItem } from "./login";

function SocialButton({ icon, label, className = "" }: AuthSocialItem) {
  return (
    <div className="auth-social-item">
      <button type="button" aria-label={label} className={`btn btn-circle h-12 min-h-12 w-12 border-base-300 bg-base-100 shadow-none hover:bg-base-200 ${className}`}>
        <img src={icon} className="h-5 w-5" alt={label} />
      </button>
      <span className="auth-social-label">{label}</span>
    </div>
  );
}

const LoginForm = () => {
  return (
    <div className="auth-card w-full p-8 sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="auth-logo-shell mb-4">
          <img src={Logo} alt="QQM Logo" className="size-[100px] object-contain" />
        </div>
        <h1 className="auth-section-title text-base-content">Login</h1>
      </div>

      <div className="space-y-4">
        {loginFields.map((field) => (
          <label key={field.name} className="form-control gap-2">
            <span className="text-xs font-medium text-base-content/80">{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              placeholder=""
              className="auth-field input input-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-[#6600FF]"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        <label className="flex cursor-pointer items-center gap-2 text-base-content/80">
          <input type="checkbox" className="checkbox checkbox-xs rounded-[4px] border-base-300" defaultChecked />
          <span className="label-text text-base-content/80">Simpan Informasi</span>
        </label>
        <button type="button" className="font-medium text-[#4C8DFF] transition-opacity hover:opacity-80">
          Lupa Password?
        </button>
      </div>

      <button className="auth-submit btn mt-4 w-full border-none bg-primary text-primary-content shadow-none transition-transform hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
        Login
      </button>

      <div className="mt-12 text-center">
        <div className="text-xs font-bold text-base-content/85">Lanjutkan Menggunakan</div>

        <div className="mt-6 flex justify-center gap-8">
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
    </div>
  );
};

function LoginComponent() {
  return (
    <div className="min-h-screen bg-base-100 px-4 py-4 font-sans text-base-content">
      <div className="mx-auto flex max-w-5xl justify-end">
        <SwitchTheme />
      </div>

      <div className="auth-stage mx-auto flex max-w-5xl items-center justify-center">
        <BorderGlow
          className="w-full max-w-[406px]"
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
          <LoginForm />
        </BorderGlow>
      </div>
    </div>
  );
}

export default LoginComponent;
