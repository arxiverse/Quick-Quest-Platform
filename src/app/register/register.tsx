import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SwitchTheme } from "../global.theme";
import { ApiRequestError } from "../global.service";
import Logo from "../../assets/Figma/QQMLogo.png";
import BorderGlow from "../../Animation/BorderGlow";
import {
  DUMMY_OTP_CODE,
  getRegisterStep,
  initialRegisterFormState,
  registerSocialItems,
  registerStepFlow,
  registerTimelineSteps,
  type AuthSocialItem,
  type RegisterField,
  type RegisterFieldName,
  type RegisterFormState,
} from "./register";
import {
  hasRegisterStepErrors,
  registerUser,
  validateRegisterStep,
  type RegisterStepErrors,
} from "./register.service";

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

function RegisterFieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: RegisterField;
  value: string;
  error?: string;
  onChange: (name: RegisterFieldName, value: string) => void;
}) {
  return (
    <label className="form-control gap-2">
      <span className="text-xs font-medium text-base-content/80">{field.label}</span>
      {field.as === "textarea" ? (
        <textarea
          name={field.name}
          value={value}
          rows={field.rows ?? 3}
          placeholder={field.placeholder ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          className="auth-field textarea textarea-bordered w-full resize-none border-base-300 bg-base-100 text-base-content focus:border-[#6600FF]"
        />
      ) : (
        <input
          type={field.type}
          name={field.name}
          value={value}
          placeholder={field.placeholder ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          className="auth-field input input-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-[#6600FF]"
        />
      )}
      {error ? <span className="text-xs text-error">{error}</span> : null}
    </label>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<RegisterFormState>(initialRegisterFormState);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepErrors, setStepErrors] = useState<RegisterStepErrors>({});
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepKey = registerStepFlow[stepIndex];
  const step = getRegisterStep(stepKey);
  const isLastStep = stepIndex === registerStepFlow.length - 1;

  const timelineStatus = useMemo(() => {
    return registerTimelineSteps.map((item, index) => {
      if (item.key === step.key) {
        return { ...item, state: "active" } as const;
      }

      return {
        ...item,
        state: index < stepIndex ? "done" : "upcoming",
      } as const;
    });
  }, [step.key, stepIndex]);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      const response = await registerUser(formState);
      navigate("/login", {
        replace: true,
        state: {
          flashMessage: response.message || "Register berhasil, lanjut login ya.",
          identityHint: formState.email || formState.username,
        },
      });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setRequestMessage(error.message);
      } else {
        setRequestMessage("Register gagal diproses, coba ulang beberapa saat lagi.");
      }
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

  return (
    <form className="auth-card w-full max-w-full p-6 sm:p-10" onSubmit={handleSubmit}>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="auth-logo-shell mb-4">
          <img src={Logo} alt="QQM Logo" className="size-[92px] object-contain sm:size-[100px]" />
        </div>
        <h1 className="auth-section-title text-base-content">{step.title}</h1>
        <p className="mt-1 text-xs text-base-content/70">{step.orderLabel}</p>
      </div>

      <div className="mb-5 rounded-2xl border border-base-300 bg-base-100 p-3">
        <div className="grid grid-cols-5 gap-2">
          {timelineStatus.map((item) => (
            <div key={item.key} className="space-y-2">
              <div
                className={`h-1.5 rounded-full ${
                  item.state === "active"
                    ? "bg-primary"
                    : item.state === "done"
                    ? "bg-success"
                    : "bg-base-300"
                }`}
              />
              <p className="truncate text-[10px] text-base-content/70">{item.key === "otp" ? "OTP" : item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-dashed border-base-300 bg-base-100/70 p-3">
        <p className="text-sm font-semibold text-base-content">{step.headline}</p>
        <p className="mt-1 text-xs text-base-content/70">{step.description}</p>
      </div>

      {step.key === "otp" ? (
        <div className="mb-4 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-base-content/80">
          <p className="font-semibold text-base-content">OTP dummy sementara: {DUMMY_OTP_CODE}</p>
          <p className="mt-1">Masukin kode ini dulu biar step verifikasi tetap kebaca kayak alur production.</p>
        </div>
      ) : null}

      <div className="space-y-4">
        {step.fields.map((field) => (
          <RegisterFieldControl
            key={field.name}
            field={field}
            value={formState[field.name]}
            error={stepErrors[field.name]}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      {requestMessage ? (
        <div className="alert alert-error mt-4 py-2 text-sm">
          <span>{requestMessage}</span>
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-outline flex-1 border-base-300"
          disabled={stepIndex === 0 || isSubmitting}
        >
          Kembali
        </button>
        <button
          type="submit"
          className="auth-submit btn flex-1 border-none bg-primary text-primary-content shadow-none transition-transform hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Proses..." : step.nextLabel ?? "Selanjutnya"}
        </button>
      </div>

      {step.key === "account" ? (
        <div className="mt-10 text-center">
          <div className="text-xs font-bold text-base-content/85">Atau menggunakan</div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-8">
            {registerSocialItems.map((item) => (
              <SocialButton key={item.label} {...item} />
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-10 text-center text-xs text-base-content/80">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-medium text-[#4C8DFF] hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}

function RegisterComponent() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-base-100 px-3 py-4 font-sans text-base-content sm:px-4">
      <div className="mx-auto flex w-full max-w-5xl justify-end">
        <SwitchTheme />
      </div>

      <div className="auth-stage mx-auto flex w-full max-w-5xl items-center justify-center overflow-x-hidden">
        <BorderGlow
          className="w-full max-w-[520px] overflow-hidden"
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
