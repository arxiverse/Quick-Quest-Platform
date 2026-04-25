import { useState } from "react";
import { ArrowLeftIcon } from "../../../home.icons";
import { Surface, cn } from "../../../home.ui";
import {
  BOOST_PACKAGES,
  MOCK_WALLET_BALANCE,
  type BoostPackage,
} from "../promotion";

type PaymentMethod = "saldo" | "qris" | "transfer";
type PaymentStep = "summary" | "method" | "success";

function StepIndicator({ step }: { step: PaymentStep }) {
  const steps: { id: PaymentStep; label: string }[] = [
    { id: "summary", label: "Ringkasan" },
    { id: "method", label: "Pembayaran" },
    { id: "success", label: "Selesai" },
  ];
  const activeIdx = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                i < activeIdx
                  ? "bg-success text-white"
                  : i === activeIdx
                    ? "bg-primary text-primary-content shadow-md shadow-primary/30"
                    : "bg-base-200 text-base-content/40",
              )}
            >
              {i < activeIdx ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide",
                i === activeIdx ? "text-primary" : "text-base-content/40",
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-[2px] flex-1 mx-2 mb-4 rounded-full transition-all duration-500",
                i < activeIdx ? "bg-success" : "bg-base-300",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PackageCard({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: BoostPackage;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative cursor-pointer rounded-[14px] border-2 p-4 transition-all duration-200",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-base-300 bg-base-100 hover:border-primary/40",
      )}
    >
      {pkg.badge && (
        <span className="absolute -top-2.5 right-4 bg-linear-to-r from-[#A046FF] to-[#38BDF8] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
          {pkg.badge}
        </span>
      )}
      {isSelected && (
        <div className="absolute top-3 left-3 size-4 rounded-full bg-primary flex items-center justify-center">
          <span className="text-[10px] text-white font-bold">✓</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex-1">
          <p
            className={cn(
              "font-bold text-sm",
              isSelected ? "text-primary" : "text-base-content",
            )}
          >
            {pkg.name}
          </p>
          <p className="text-[11px] text-base-content/55 mt-0.5">
            {pkg.durationLabel}
          </p>
        </div>
        <p
          className={cn(
            "font-black text-base shrink-0",
            pkg.price === 0 ? "text-success" : "text-base-content",
          )}
        >
          {pkg.priceLabel}
        </p>
      </div>
      <ul className="mt-3 space-y-1 pl-2">
        {pkg.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-1.5 text-[11px] text-base-content/70"
          >
            <span className="text-success shrink-0">✓</span> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SuccessScreen({
  pkg,
  onDone,
}: {
  pkg: BoostPackage;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="size-24 rounded-full bg-success/15 flex items-center justify-center text-5xl mb-2 shadow-lg shadow-success/20 animate-in zoom-in duration-700">
          🎉
        </div>
        <div className="absolute -top-1 -right-1 size-8 rounded-full bg-success flex items-center justify-center text-white text-lg shadow-md">
          ✓
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-base-content mt-6 mb-2">
        Boost Aktif!
      </h2>
      <p className="text-sm text-base-content/65 max-w-sm leading-relaxed">
        Postingan jasa kamu sekarang tampil di{" "}
        <span className="font-bold text-primary">Hero Spotlight VIP</span>{" "}
        selama <span className="font-bold">{pkg.durationLabel}</span>. Bersiap
        diserbu Giver!
      </p>

      <div className="mt-6 w-full max-w-sm rounded-[14px] border border-base-300 bg-base-100 divide-y divide-base-200">
        <div className="flex justify-between items-center px-4 py-3">
          <p className="text-xs font-semibold text-base-content/55 uppercase tracking-wider">
            Paket
          </p>
          <p className="text-sm font-bold text-base-content">{pkg.name}</p>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <p className="text-xs font-semibold text-base-content/55 uppercase tracking-wider">
            Durasi
          </p>
          <p className="text-sm font-bold text-base-content">
            {pkg.durationLabel}
          </p>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <p className="text-xs font-semibold text-base-content/55 uppercase tracking-wider">
            Biaya
          </p>
          <p className="text-sm font-black text-primary">{pkg.priceLabel}</p>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <p className="text-xs font-semibold text-base-content/55 uppercase tracking-wider">
            Status
          </p>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-success">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            LIVE SEKARANG
          </span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="btn mt-8 w-full max-w-sm bg-primary text-primary-content border-none font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
      >
        Lihat Postingan Saya 🚀
      </button>
    </div>
  );
}

export function PromotionPayment({
  boostPackageId,
  postTitle,
  onBack,
  onDone,
}: {
  boostPackageId: string;
  postTitle: string;
  onBack: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<PaymentStep>("summary");
  const [selectedPkgId, setSelectedPkgId] = useState(boostPackageId);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("saldo");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPkg =
    BOOST_PACKAGES.find((p) => p.id === selectedPkgId) ?? BOOST_PACKAGES[1];
  const wallet = MOCK_WALLET_BALANCE;
  const canPayWithSaldo = wallet.available >= selectedPkg.price;

  function handleProceedToMethod() {
    if (selectedPkg.price === 0) {
      simulatePayment();
    } else {
      setStep("method");
    }
  }

  function simulatePayment() {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 1800);
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto w-full py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <SuccessScreen pkg={selectedPkg} onDone={onDone} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl mx-auto w-full pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={step === "method" ? () => setStep("summary") : onBack}
          className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
        >
          <ArrowLeftIcon className="size-4" />
          {step === "method" ? "Ganti Paket" : "Batal"}
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-base-content tracking-tight leading-none">
            {step === "method" ? "Pilih Metode Bayar" : "Pilih Paket Iklan"}
          </h1>
          <p className="text-[11px] text-base-content/55 font-medium mt-0.5 truncate max-w-xs">
            Untuk: "{postTitle}"
          </p>
        </div>
      </div>

      <StepIndicator step={step} />

      {/* Step 1 — Summary: Pilih Paket */}
      {step === "summary" && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-3">
            {BOOST_PACKAGES.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedPkgId === pkg.id}
                onSelect={() => setSelectedPkgId(pkg.id)}
              />
            ))}
          </div>

          {/* Wallet Peek */}
          <Surface className="p-4 flex items-center justify-between gap-3 border border-base-300">
            <div>
              <p className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider">
                Saldo QQM Kamu
              </p>
              <p className="text-lg font-black text-base-content mt-0.5">
                {wallet.availableLabel}
              </p>
            </div>
            {selectedPkg.price > 0 && (
              <span
                className={cn(
                  "text-[11px] font-bold px-2.5 py-1 rounded-[8px]",
                  canPayWithSaldo
                    ? "bg-success/15 text-success"
                    : "bg-error/15 text-error",
                )}
              >
                {canPayWithSaldo ? "✓ Saldo Cukup" : "✗ Saldo Kurang"}
              </span>
            )}
          </Surface>

          <button
            onClick={handleProceedToMethod}
            className="btn border-none bg-primary text-primary-content font-bold w-full shadow-lg shadow-primary/25 hover:scale-[1.01] transition-transform"
          >
            {selectedPkg.price === 0
              ? "Publikasikan Gratis"
              : `Lanjut Bayar ${selectedPkg.priceLabel}`}{" "}
            →
          </button>
        </div>
      )}

      {/* Step 2 — Payment Method */}
      {step === "method" && (
        <div className="flex flex-col gap-4">
          {/* Order Summary Card */}
          <Surface className="p-4 border border-primary/20 bg-primary/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-2">
              Ringkasan Order
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-base-content">
                  {selectedPkg.name}
                </p>
                <p className="text-xs text-base-content/60">
                  {selectedPkg.durationLabel}
                </p>
              </div>
              <p className="text-xl font-black text-primary">
                {selectedPkg.priceLabel}
              </p>
            </div>
          </Surface>

          {/* Method Selector */}
          <Surface className="p-5 border border-base-300 flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">
              Pilih Cara Pembayaran
            </p>

            {/* Saldo QQM */}
            <div
              onClick={() => setPaymentMethod("saldo")}
              className={cn(
                "flex items-center gap-4 p-4 cursor-pointer rounded-[12px] border-2 transition-all",
                paymentMethod === "saldo"
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-primary/30",
              )}
            >
              <span className="text-2xl">💳</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-base-content">Saldo QQM</p>
                <p className="text-[11px] text-base-content/55">
                  Tersedia: {wallet.availableLabel}
                  {!canPayWithSaldo && (
                    <span className="ml-2 text-error font-semibold">
                      (Saldo tidak cukup)
                    </span>
                  )}
                </p>
              </div>
              <div
                className={cn(
                  "size-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  paymentMethod === "saldo"
                    ? "border-primary bg-primary"
                    : "border-base-300",
                )}
              >
                {paymentMethod === "saldo" && (
                  <span className="size-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* QRIS */}
            <div
              onClick={() => setPaymentMethod("qris")}
              className={cn(
                "flex items-center gap-4 p-4 cursor-pointer rounded-[12px] border-2 transition-all",
                paymentMethod === "qris"
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-primary/30",
              )}
            >
              <span className="text-2xl">📱</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-base-content">QRIS</p>
                <p className="text-[11px] text-base-content/55">
                  GoPay · OVO · Dana · ShopeePay · dll
                </p>
              </div>
              <div
                className={cn(
                  "size-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  paymentMethod === "qris"
                    ? "border-primary bg-primary"
                    : "border-base-300",
                )}
              >
                {paymentMethod === "qris" && (
                  <span className="size-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* Transfer Bank */}
            <div
              onClick={() => setPaymentMethod("transfer")}
              className={cn(
                "flex items-center gap-4 p-4 cursor-pointer rounded-[12px] border-2 transition-all",
                paymentMethod === "transfer"
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-primary/30",
              )}
            >
              <span className="text-2xl">🏦</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-base-content">
                  Transfer Bank
                </p>
                <p className="text-[11px] text-base-content/55">
                  BCA · BRI · Mandiri · BNI · dll
                </p>
              </div>
              <div
                className={cn(
                  "size-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  paymentMethod === "transfer"
                    ? "border-primary bg-primary"
                    : "border-base-300",
                )}
              >
                {paymentMethod === "transfer" && (
                  <span className="size-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </Surface>

          {/* QR Code / VA Number placeholder */}
          {paymentMethod === "qris" && (
            <Surface className="p-6 border border-base-300 flex flex-col items-center gap-3 animate-in fade-in duration-300">
              <div className="size-36 rounded-[12px] bg-base-200 border-2 border-dashed border-base-300 flex items-center justify-center">
                <p className="text-xs text-base-content/40 font-semibold text-center leading-relaxed px-2">
                  QR Code
                  <br />
                  akan muncul
                  <br />
                  di sini
                </p>
              </div>
              <p className="text-[11px] text-base-content/50 font-medium">
                Scan dengan aplikasi e-wallet apapun
              </p>
            </Surface>
          )}

          {paymentMethod === "transfer" && (
            <Surface className="p-5 border border-base-300 animate-in fade-in duration-300">
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-3">
                Virtual Account Number
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏦</span>
                <div className="flex-1">
                  <p className="text-xs text-base-content/50">
                    Bank BCA (Dummy)
                  </p>
                  <p className="font-black text-xl text-base-content tracking-widest">
                    1234-5678-9012
                  </p>
                </div>
                <button className="btn btn-sm btn-outline h-8 min-h-8 font-bold text-xs">
                  Salin
                </button>
              </div>
              <p className="text-[11px] text-base-content/50 mt-3">
                ⏱ Kode VA berlaku 24 jam sejak order dibuat
              </p>
            </Surface>
          )}

          {/* Bayar Button */}
          <button
            onClick={simulatePayment}
            disabled={
              isProcessing || (paymentMethod === "saldo" && !canPayWithSaldo)
            }
            className="btn border-none bg-primary text-primary-content font-bold w-full shadow-lg shadow-primary/25 hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                Memproses Pembayaran...
              </span>
            ) : paymentMethod === "saldo" ? (
              `Bayar ${selectedPkg.priceLabel} dari Saldo`
            ) : paymentMethod === "qris" ? (
              "Saya Sudah Bayar via QRIS"
            ) : (
              "Konfirmasi Transfer"
            )}
          </button>

          <p className="text-[11px] text-base-content/40 text-center font-medium">
            🛡️ Pembayaran diamankan oleh sistem QQM Escrow. Data kamu aman.
          </p>
        </div>
      )}
    </div>
  );
}
