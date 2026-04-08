import { Link } from "react-router-dom";
import { SwitchTheme } from "../global.theme";
import Logo from "../../assets/Figma/QQMLogo.png";
import BorderGlow from "../../Animation/BorderGlow";
import { registerFields, registerSocialItems, type AuthSocialItem } from "./register";

function SocialButton({ icon, label, className = "" }: AuthSocialItem) {
  return (
    <div className="auth-social-item min-w-0">
      <button type="button" aria-label={label} className={`btn btn-circle h-12 min-h-12 w-12 border-base-300 bg-base-100 shadow-none hover:bg-base-200 ${className}`}>
        <img src={icon} className="h-5 w-5" alt={label} />
      </button>
      <span className="auth-social-label">{label}</span>
    </div>
  );
}

const RegisterForm = () => {
  return (
    <div className="auth-card w-full max-w-full p-6 sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="auth-logo-shell mb-4">
          <img src={Logo} alt="QQM Logo" className="size-[92px] object-contain sm:size-[100px]" />
        </div>
        <h1 className="auth-section-title text-base-content">Register</h1>
      </div>

      <div className="space-y-4">
        {registerFields.map((field) => (
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

      <button className="auth-submit btn mt-7 w-full border-none bg-primary text-primary-content shadow-none transition-transform hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
        Selanjutnya
      </button>

      <div className="mt-12 text-center">
        <div className="text-xs font-bold text-base-content/85">Atau menggunakan</div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-8">
          {registerSocialItems.map((item) => (
            <SocialButton key={item.label} {...item} />
          ))}
        </div>
      </div>

      <p className="mt-16 text-center text-xs text-base-content/80">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-medium text-[#4C8DFF] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

function RegisterComponent() {
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
          <RegisterForm />
        </BorderGlow>
      </div>
    </div>
  );
}

export default RegisterComponent;
