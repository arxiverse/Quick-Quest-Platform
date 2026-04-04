import { SwitchTheme } from "../global.theme";
import Logo from "../../assets/Figma/QQMLogo.png";
import GoogleLogo from "../../assets/svg/google-logo.svg";
import LinkedinLogo from "../../assets/svg/linkedin-logo.svg";
import {Link } from "react-router-dom";

import BorderGlow from "../../Animation/BorderGlow";

const RegisterForm = () => {
  return (
    <div className="w-full bg-dark border border-white/20 rounded-[28px] p-8 space-y-6">
      <div className="flex flex-col items-center rounded-[28px]">
        <div className="w-[100px] h-[100px] mb-2 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${Logo})` }} />
        <h1 className="text-3xl font-bold text-primary">Register</h1>
      </div>
      <div className="space-y-4">
          <div className="form-control">
            <input type="text" placeholder="Username"
              className="input input-bordered w-full rounded-[10px] bg-black/20 border-white/10 text-white placeholder:text-primary/60 focus:border-primary transition-all"
            />
          </div>

          <div className="form-control">
            <input type="text" placeholder="Email"
              className="input input-bordered w-full rounded-[10px] bg-black/20 border-white/10 text-white placeholder:text-primary/60 focus:border-primary transition-all"
            />
          </div>

          <div className="form-control">
            <input type="password" placeholder="Password"
              className="input input-bordered w-full rounded-[10px] bg-black/20 border-white/10 text-primary/50 placeholder:text-primary/60 focus:border-primary transition-all"
            />
          </div>
        </div>

        <button className="btn btn-primary w-full rounded-[10px] text-lg font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform">
          Selanjutnya
        </button>

        <div className="text-center space-y-4">
          <div className="divider text-[10px] font-bold text-primary/40 uppercase before:bg-white/10 after:bg-white/10">
            Atau Menggunakan
          </div>

          <div className="flex justify-center gap-6">
            <button className="btn btn-circle bg-white/5 border-white/10 hover:bg-white/20">
              <img src={GoogleLogo} className="w-6 h-6" alt="Google" />
            </button>
            <button className="btn btn-circle bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/40">
              <img src={LinkedinLogo} className="w-6 h-6" alt="LinkedIn" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <p className="text-center text-xs text-primary">
            Sudah punya akun? {"   "}
            <Link to="/login" className="text-info font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
    </div>
  );
};

function RegisterComponent() {
  return (
    <div className="theme-bg min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 font-sans overflow-x-hidden">
      <div className="absolute top-4 right-4 z-50">
        <SwitchTheme />
      </div>

      <BorderGlow
        className="w-full max-w-md sm:max-w-[406px]"
        edgeSensitivity={30}
        coneSpread={14}
        glowColor="40 80 80"
        backgroundColor="rgb(255, 255, 255)03)"
        borderRadius={28}
        glowRadius={80}
        glowIntensity={1.8}
        animated={true}
        colors={["#9500ff"]}
        fillOpacity={0.15}
        >
        <RegisterForm />
      </BorderGlow>
    </div>
  );
}

export default RegisterComponent;