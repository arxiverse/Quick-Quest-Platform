import type { RunnerQuestFeedItem } from "../../runner.service";
import {
  RUNNER_QUEST_FEED_SUBVIEW_STORAGE_KEY_SEED,
  getRunnerQuestFeedSeed,
} from "./quest-feed.service";

export type RunnerQuestFeedSubView = null | { view: "Detail"; questId: string };

export const runnerQuestFeedSubViewStorageKey =
  RUNNER_QUEST_FEED_SUBVIEW_STORAGE_KEY_SEED;

export function useRunnerQuestFeedVM() {
  return {
    quests: getRunnerQuestFeedSeed(),
  };
}

export function resolveQuestFeedModeClass(mode: RunnerQuestFeedItem["mode"]) {
  return mode === "group"
    ? "bg-secondary/10 text-secondary"
    : "bg-info/10 text-info";
}

export function resolveInitialRunnerQuestFeedSubView(): RunnerQuestFeedSubView {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(runnerQuestFeedSubViewStorageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as RunnerQuestFeedSubView;
    if (!parsed) {
      return null;
    }

    return parsed.view === "Detail" && parsed.questId ? parsed : null;
  } catch {
    return null;
  }
}

export function syncRunnerQuestFeedSubViewStorage(
  subView: RunnerQuestFeedSubView,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (subView) {
    window.localStorage.setItem(
      runnerQuestFeedSubViewStorageKey,
      JSON.stringify(subView),
    );
  } else {
    window.localStorage.removeItem(runnerQuestFeedSubViewStorageKey);
  }
}
