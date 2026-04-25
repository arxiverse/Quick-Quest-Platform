import { ArrowLeftIcon } from "../../../home.icons";
import { cn, Surface } from "../../../home.ui";
import FadeContent from "../../../../../Animation/Fade";
import { useQuestEditorVM, formatRupiah } from "../giver";
import type {
  EditorQuestType as QuestType,
  EditorStep,
} from "../giver.service";

export function QuestEditor({ onBack }: { onBack: () => void }) {
  const {
    step,
    setStep,
    questType,
    setQuestType,
    slotCount,
    setSlotCount,
    selectedSkills,
    toggleSkill,
    upahMin,
    setUpahMin,
    upahMax,
    setUpahMax,
    baseRadius,
    setBaseRadius,
    escrowLocked,
    setEscrowLocked,
    upahMinNum,
    upahMaxNum,
    totalEscrowMin,
    totalEscrowMax,
    platformFeeMin,
    platformFeeMax,
    totalDepositMax,
    canProceedStep1,
    canProceedStep2,
    canBroadcast,
    skillTags: SKILL_TAGS,
  } = useQuestEditorVM();

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Giver Center
      </button>

      {/* Step Indicator */}
      <Surface className="p-4 sm:p-5">
        <div className="flex items-center gap-0">
          {(
            [
              { n: 1, label: "Detail Quest" },
              { n: 2, label: "Konfigurasi" },
              { n: 3, label: "Deposit Escrow" },
            ] as { n: EditorStep; label: string }[]
          ).map((s, i) => (
            <div key={s.n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    step > s.n
                      ? "bg-[#10B981] text-white"
                      : step === s.n
                        ? "bg-[#6B21FF] text-white shadow-lg shadow-[#6B21FF]/30"
                        : "bg-base-200 text-base-content/50",
                  )}
                >
                  {step > s.n ? "✓" : s.n}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold whitespace-nowrap",
                    step === s.n ? "text-base-content" : "text-base-content/45",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={cn(
                    "mb-5 h-0.5 flex-1 mx-2 transition-colors",
                    step > s.n ? "bg-[#10B981]" : "bg-base-300",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-[#38BDF8]/10 rounded-bl-[100px] blur-2xl pointer-events-none" />

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">
          Quest Editor — Step {step}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-base-content">
          {step === 1 && "Isi Detail Pekerjaan"}
          {step === 2 && "Konfigurasi Broadcast"}
          {step === 3 && "Deposit Escrow & Broadcast"}
        </h1>

        {/* ── STEP 1: Detail Quest ── */}
        {step === 1 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 relative z-10">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-base-content/70">
                  Judul Quest
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100"
                  placeholder="e.g. Bongkar Muat Barang Gudang"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/70">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  className="textarea textarea-bordered w-full mt-1.5 h-28 focus:border-[#38BDF8] bg-base-100"
                  placeholder="Jelaskan secara rinci tugas runner, alat yang diperlukan, dan kondisi lapangan..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-base-content/70">
                    Mode
                  </label>
                  <select className="select select-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100">
                    <option>Fisik (On-Site)</option>
                    <option>Digital (Remote)</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-base-content/70">
                    Kategori
                  </label>
                  <select className="select select-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100">
                    <option>Event Organizer</option>
                    <option>Gudang & Logistik</option>
                    <option>IT & Jaringan</option>
                    <option>Kuliner & Katering</option>
                    <option>Administrasi</option>
                  </select>
                </div>
              </div>

              {/* Skill Tags */}
              <div>
                <label className="text-xs font-bold text-base-content/70">
                  Skill Tag{" "}
                  <span className="text-error text-[10px]">*Wajib</span>
                </label>
                <p className="text-[10px] text-base-content/50 mt-0.5 mb-2">
                  Sistem matching Runner berdasarkan skill tag ini. Pilih
                  minimal 1.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_TAGS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "rounded-[8px] px-2.5 py-1 text-[11px] font-semibold transition-all",
                        selectedSkills.includes(skill)
                          ? "bg-[#6B21FF] text-white shadow-md shadow-[#6B21FF]/20"
                          : "bg-base-200 text-base-content/70 hover:bg-base-300",
                      )}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {selectedSkills.length > 0 && (
                  <p className="mt-2 text-[11px] font-semibold text-[#10B981]">
                    ✓ {selectedSkills.length} skill dipilih
                  </p>
                )}
              </div>
            </div>

            {/* Upah Min/Max */}
            <div className="space-y-4 rounded-[12px] border border-base-300/70 bg-base-100 p-4 shadow-sm">
              <div>
                <p className="text-xs font-bold text-base-content/70">
                  Tipe Quest
                </p>
                <p className="text-[10px] text-base-content/50 mb-2 mt-0.5">
                  Pilih Solo untuk 1 Runner, Kelompok untuk tim.
                </p>
                <div className="inline-flex rounded-[10px] bg-base-200 p-1 w-full">
                  {(["SOLO", "KELOMPOK"] as QuestType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQuestType(t)}
                      className={cn(
                        "btn flex-1 h-9 min-h-9 rounded-[8px] border-none text-xs shadow-none",
                        questType === t
                          ? "bg-primary text-primary-content"
                          : "bg-transparent text-base-content/70 hover:bg-base-100",
                      )}
                    >
                      {t === "SOLO" ? "Per-Individu" : "Ber-Kelompok"}
                    </button>
                  ))}
                </div>
              </div>

              {questType === "KELOMPOK" && (
                <div>
                  <label className="text-xs font-bold text-base-content/70">
                    Jumlah Runner Dibutuhkan
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    className="input input-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100"
                    value={slotCount}
                    onChange={(e) =>
                      setSlotCount(Math.max(2, parseInt(e.target.value) || 2))
                    }
                  />
                </div>
              )}

              <div className="pt-1 border-t border-base-200">
                <label className="text-xs font-bold text-base-content/70">
                  Estimasi Upah Minimum (Rp)
                </label>
                <p className="text-[10px] text-base-content/50 mb-1.5 mt-0.5">
                  Jika pekerjaan sesuai ekspektasi minimal
                </p>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-sm font-bold text-base-content/50">
                      Rp
                    </span>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-100 pl-10 focus:border-[#38BDF8] font-bold"
                    placeholder="50.000"
                    value={upahMin}
                    onChange={(e) => setUpahMin(formatRupiah(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/70">
                  Estimasi Upah Maksimum (Rp)
                </label>
                <p className="text-[10px] text-base-content/50 mb-1.5 mt-0.5">
                  Jika pekerjaan melampaui ekspektasi (bonus)
                </p>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-sm font-bold text-base-content/50">
                      Rp
                    </span>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-100 pl-10 focus:border-[#38BDF8] font-bold"
                    placeholder="150.000"
                    value={upahMax}
                    onChange={(e) => setUpahMax(formatRupiah(e.target.value))}
                  />
                </div>
                {upahMin && upahMax && upahMaxNum < upahMinNum && (
                  <p className="mt-1.5 text-[11px] font-semibold text-error">
                    ⚠ Upah maksimum harus ≥ upah minimum
                  </p>
                )}
              </div>

              {upahMin && upahMax && upahMaxNum >= upahMinNum && (
                <div className="rounded-[10px] bg-[#F0FDF4] border border-[#BBF7D0] p-3">
                  <p className="text-[11px] font-bold text-[#166534] uppercase tracking-wide">
                    Estimasi Rentang Upah
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#166534]">
                    Rp {upahMin} — Rp {upahMax}
                    {questType === "KELOMPOK" && ` × ${slotCount} runner`}
                  </p>
                  <p className="text-[10px] text-[#166534]/70 mt-0.5">
                    Rentang upah menilai kualitas kerja Runner secara adil
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-base-200">
                <button
                  type="button"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="btn h-12 w-full rounded-[10px] border-none bg-linear-to-r from-[#38BDF8] to-[#A046FF] text-white font-bold shadow-lg shadow-[#38BDF8]/20 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Lanjut ke Konfigurasi →
                </button>
                {!canProceedStep1 && (
                  <p className="mt-1.5 text-center text-[10px] text-base-content/50">
                    Pilih skill tag dan isi rentang upah terlebih dahulu
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Konfigurasi Broadcast ── */}
        {step === 2 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 relative z-10">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-base-content/70">
                  Radius Awal Broadcast (km)
                </label>
                <p className="text-[10px] text-base-content/50 mt-0.5">
                  Sistem akan expand otomatis +1km setiap 5 menit jika belum
                  match.
                </p>
                <div className="mt-3">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={baseRadius}
                    onChange={(e) => setBaseRadius(parseInt(e.target.value))}
                    className="range range-xs range-info"
                  />
                  <div className="flex justify-between text-[10px] font-bold mt-1 text-base-content/50">
                    <span>1 KM</span>
                    <span className="text-[#38BDF8] font-bold">
                      {baseRadius} KM terpilih
                    </span>
                    <span>10 KM</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/70">
                  Lokasi Quest
                </label>
                <p className="text-[10px] text-base-content/50 mt-0.5 mb-2">
                  GPS otomatis atau isi manual jika berbeda.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 focus:border-[#38BDF8] bg-base-100 text-sm"
                    placeholder="Jl. Jenderal Sudirman No. 1..."
                    defaultValue="Jakarta Selatan (GPS Auto)"
                  />
                  <button
                    type="button"
                    className="btn h-11.5 min-h-11.5 rounded-[10px] border-none bg-[#38BDF8]/20 px-3 text-[#38BDF8] hover:bg-[#38BDF8]/30"
                  >
                    📍
                  </button>
                </div>
              </div>

              <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
                  Preview Broadcast Logic
                </p>
                <div className="mt-2 space-y-1.5">
                  {[
                    {
                      fase: "Broadcast Awal",
                      dur: "0–15 menit",
                      rad: `${baseRadius} km`,
                    },
                    {
                      fase: "Ekspansi 1",
                      dur: "+5 menit",
                      rad: `${baseRadius + 1} km`,
                    },
                    {
                      fase: "Ekspansi 2",
                      dur: "+5 menit",
                      rad: `${baseRadius + 2} km`,
                    },
                    {
                      fase: "Ekspansi N",
                      dur: "+5 mnt/fase",
                      rad: "+1 km/fase",
                    },
                  ].map((row) => (
                    <div
                      key={row.fase}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-base-content/70 font-medium">
                        {row.fase}
                      </span>
                      <div className="flex gap-2">
                        <span className="rounded bg-base-200 px-1.5 py-0.5 font-semibold text-base-content/80 text-[10px]">
                          {row.dur}
                        </span>
                        <span className="rounded bg-[#DBEAFE] px-1.5 py-0.5 font-bold text-[#1D4ED8] text-[10px]">
                          {row.rad}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[12px] border border-base-300/70 bg-base-100 p-4 shadow-sm">
              <div>
                <p className="text-xs font-bold text-base-content/70">
                  Ringkasan Quest
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/65">Tipe</span>
                    <span className="font-bold text-base-content">
                      {questType === "SOLO"
                        ? "Per-Individu"
                        : `Ber-Kelompok (${slotCount} orang)`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/65">Skill Tags</span>
                    <span className="font-bold text-base-content">
                      {selectedSkills.length > 0
                        ? `${selectedSkills.length} dipilih`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/65">Rentang Upah</span>
                    <span className="font-bold text-[#10B981]">
                      {upahMin && upahMax
                        ? `Rp ${upahMin} – Rp ${upahMax}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/65">Radius Awal</span>
                    <span className="font-bold text-base-content">
                      {baseRadius} km
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-base-200 pt-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn h-11 flex-1 rounded-[10px] border-base-300 bg-base-100 text-base-content hover:bg-base-200 text-sm shadow-none"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="button"
                    disabled={!canProceedStep2}
                    onClick={() => setStep(3)}
                    className="btn h-11 flex-1 rounded-[10px] border-none bg-linear-to-r from-[#38BDF8] to-[#A046FF] text-white font-bold shadow-lg shadow-[#38BDF8]/20 transition-transform active:scale-95"
                  >
                    Lanjut Deposit →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Deposit Escrow & Broadcast ── */}
        {step === 3 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 relative z-10">
            <div className="space-y-4">
              <div className="rounded-[12px] border border-[#FCA5A5] bg-[#FFF1F2] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#991B1B]">
                  ⚠ Perhatian Penting
                </p>
                <p className="mt-1.5 text-sm text-[#7F1D1D] leading-relaxed">
                  Quest <strong>tidak dapat dibroadcast</strong> sebelum dana
                  escrow berhasil di-deposit. Dana Runner dijamin aman oleh
                  sistem — Giver tidak bisa menarik dana setelah quest aktif.
                </p>
              </div>

              <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
                  Rincian Pembayaran Escrow
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/65">
                      Upah Runner (Min)
                    </span>
                    <span className="font-semibold">
                      Rp {totalEscrowMin.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/65">
                      Upah Runner (Max)
                    </span>
                    <span className="font-semibold">
                      Rp {totalEscrowMax.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#F59E0B]">
                    <span className="font-medium">Platform Fee (5%)</span>
                    <span className="font-bold">
                      Rp {platformFeeMin.toLocaleString("id-ID")} – Rp{" "}
                      {platformFeeMax.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="border-t border-base-200 pt-2 flex justify-between text-base font-bold text-base-content">
                    <span>Total Deposit (Max)</span>
                    <span className="text-[#10B981]">
                      Rp {totalDepositMax.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-base-content/50">
                  Dana di-hold di escrow. Cair ke Runner setelah Giver klik
                  "Terima" atau auto-release setelah 24 jam.
                </p>
              </div>

              {/* Escrow State Visual */}
              <FadeContent blur={true} duration={1000} className="w-full">
                <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55 mb-3">
                    Alur Escrow Setelah Deposit
                  </p>
                  <div className="flex items-center gap-1">
                    {[
                      {
                        state: "UNPAID",
                        color: "bg-base-300 text-base-content/50",
                      },
                      { state: "LOCKED", color: "bg-[#F59E0B] text-white" },
                      {
                        state: "IN_PROGRESS",
                        color: "bg-[#3B82F6] text-white",
                      },
                      { state: "PENDING", color: "bg-[#EF4444] text-white" },
                      { state: "RELEASED", color: "bg-[#10B981] text-white" },
                    ].map((s, i) => (
                      <div key={s.state} className="flex flex-1 items-center">
                        <div
                          className={cn(
                            "flex-1 rounded-[6px] py-1 text-center text-[9px] font-bold tracking-wide transition-all",
                            escrowLocked && i === 1
                              ? "ring-2 ring-offset-1 ring-[#F59E0B] shadow-lg shadow-[#F59E0B]/30 scale-105"
                              : "",
                            s.color,
                          )}
                        >
                          {s.state}
                        </div>
                        {i < 4 && (
                          <div className="w-1.5 h-0.5 bg-base-300 shrink-0 transition-colors" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-base-content/50">
                    Status saat ini:{" "}
                    <strong
                      className={
                        escrowLocked ? "text-[#F59E0B]" : "text-base-content/70"
                      }
                    >
                      {escrowLocked
                        ? "LOCKED — Siap Broadcast"
                        : "UNPAID — Menunggu Deposit"}
                    </strong>
                  </p>
                </div>
              </FadeContent>
            </div>

            <div className="space-y-4">
              <div className="rounded-[12px] border border-[#A046FF]/30 bg-linear-to-br from-[#A046FF]/5 to-transparent p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#A046FF]">
                  Pilih Metode Pembayaran
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    {
                      id: "va",
                      label: "Virtual Account Bank",
                      hint: "BCA, BNI, Mandiri, BRI",
                    },
                    {
                      id: "qris",
                      label: "QRIS",
                      hint: "Bayar dengan semua e-wallet",
                    },
                    {
                      id: "wallet",
                      label: "QQ Wallet",
                      hint: "Saldo tersedia: Rp 250.000",
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3 cursor-pointer hover:border-[#A046FF]/40 transition-colors"
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="radio radio-sm"
                      />
                      <div>
                        <p className="text-sm font-semibold text-base-content">
                          {method.label}
                        </p>
                        <p className="text-[11px] text-base-content/60">
                          {method.hint}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setEscrowLocked(true)}
                  disabled={escrowLocked}
                  className={cn(
                    "btn h-12 w-full rounded-[10px] border-none font-bold shadow-lg text-sm transition-all active:scale-95",
                    escrowLocked
                      ? "bg-[#10B981] text-white shadow-[#10B981]/20 cursor-default"
                      : "bg-linear-to-r from-[#F59E0B] to-[#EF4444] text-white shadow-[#F59E0B]/30 hover:opacity-90",
                  )}
                >
                  {escrowLocked
                    ? "✓ Escrow Berhasil Di-lock!"
                    : "💳 Deposit Escrow Sekarang"}
                </button>

                <button
                  type="button"
                  disabled={!canBroadcast}
                  className="btn h-12 w-full rounded-[10px] border-none bg-linear-to-r from-[#38BDF8] to-[#A046FF] text-white font-bold shadow-lg shadow-[#38BDF8]/20 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {canBroadcast
                    ? "🚀 Broadcast Quest Sekarang!"
                    : "⏳ Menunggu Deposit Escrow..."}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn h-10 w-full rounded-[10px] border-base-300 bg-base-100 text-base-content hover:bg-base-200 text-sm shadow-none"
                >
                  ← Kembali ke Konfigurasi
                </button>
              </div>

              {escrowLocked && (
                <div className="rounded-[10px] bg-[#F0FDF4] border border-[#BBF7D0] p-3 animate-in fade-in duration-300">
                  <p className="text-xs font-bold text-[#166534]">
                    ✓ Escrow Locked
                  </p>
                  <p className="text-[11px] text-[#166534]/80 mt-0.5">
                    Dana Runner telah diamankan. Quest siap di-broadcast ke
                    Runner terdekat dalam radius {baseRadius} km.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Surface>
    </div>
  );
}
