// ─── Types ────────────────────────────────────────────────────────────────────

export type RatingTarget = {
  name: string;
  role: "runner" | "giver";
  questTitle: string;
  questId: string;
};

export type RatingSubmitPayload = {
  questId: string;
  targetRole: "runner" | "giver";
  score: number;
  tags: string[];
  comment: string;
};

// ─── Re-exports (ESVMC) ───────────────────────────────────────────────────────

export {
  ratingModalCopy,
  ratingTagsByRole,
  estimatePPGain,
  resolveScoreColor,
  submitRatingDummy,
} from "./rating-modal.service";
