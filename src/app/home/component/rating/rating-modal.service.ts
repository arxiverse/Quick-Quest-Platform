import type { RatingTarget, RatingSubmitPayload } from "./rating-modal";

// ─── Copy / Labels ────────────────────────────────────────────────────────────

export const ratingModalCopy = {
  headerLabel: "Beri Rating",
  subLabel: "untuk",
  questLabel: "Quest",
  scoreLabels: ["", "Sangat Buruk", "Kurang Baik", "Cukup Baik", "Baik Sekali", "Luar Biasa!"],
  tagSectionLabel: "Apa yang paling berkesan?",
  commentPlaceholder: "Tambah komentar... (opsional)",
  commentMaxLength: 180,
  ppPreviewPrefix: "≈ +",
  ppPreviewSuffix: " PP diterima",
  submitButton: "Kirim Rating",
  skipButton: "Lewati",
  successTitle: "Rating Terkirim! 🎉",
  successPpText: "PP diberikan ke",
  loadingText: "Mengirim...",
};

// ─── Quick tag options per role ───────────────────────────────────────────────

export const ratingTagsByRole: Record<RatingTarget["role"], string[]> = {
  runner: [
    "Kerja Cepat",
    "Rapi & Bersih",
    "Tepat Waktu",
    "Profesional",
    "Ramah",
    "Melebihi Ekspektasi",
    "Komunikatif",
  ],
  giver: [
    "Instruksi Jelas",
    "Responsif",
    "Lokasi Tepat",
    "Bayar Cepat",
    "Ramah",
    "Amanat Transparan",
    "Tidak Ribet",
  ],
};

// ─── PP Gain preview (visual only, actual calc di BE) ─────────────────────────

export function estimatePPGain(score: number): number {
  if (score === 0) return 0;
  // PP_skill = Rating × Difficulty × Value (simplified preview)
  const baseGain = [0, 10, 25, 50, 85, 130][score] ?? 0;
  return baseGain;
}

// ─── Score ring color ─────────────────────────────────────────────────────────

export function resolveScoreColor(score: number): string {
  if (score >= 5) return "#16a34a";
  if (score >= 4) return "#2563EB";
  if (score >= 3) return "#f59e0b";
  if (score >= 2) return "#ea580c";
  if (score >= 1) return "#dc2626";
  return "#9ca3af";
}

// ─── Dummy submit (replace with real BE call when ready) ─────────────────────

export async function submitRatingDummy(
  _payload: RatingSubmitPayload,
): Promise<void> {
  // Placeholder — wire to POST /api/ratings/quest/:id/runner or /giver when BE ready
  return new Promise((resolve) => setTimeout(resolve, 800));
}
