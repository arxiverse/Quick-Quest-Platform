import { useCallback, useEffect, useState } from "react";
import type { RunnerQuestFeedItem } from "../../runner.service";
import {
  RUNNER_QUEST_FEED_SUBVIEW_STORAGE_KEY_SEED,
  fetchRunnerQuestFeedLive,
  getRunnerQuestFeedSeed,
  takeRunnerQuestLive,
} from "./quest-feed.service";

export type RunnerQuestFeedSubView = null | { view: "Detail"; questId: string };

export const runnerQuestFeedSubViewStorageKey =
  RUNNER_QUEST_FEED_SUBVIEW_STORAGE_KEY_SEED;

export function useRunnerQuestFeedVM() {
  const [quests, setQuests] = useState<RunnerQuestFeedItem[]>(getRunnerQuestFeedSeed);
  const [isLoading, setIsLoading] = useState(false);
  const [actionQuestId, setActionQuestId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const items = await fetchRunnerQuestFeedLive();
      setQuests(items.length > 0 ? items : getRunnerQuestFeedSeed());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil quest feed.");
      setQuests(getRunnerQuestFeedSeed());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const takeQuest = useCallback(async (questId: string) => {
    setActionQuestId(questId);
    setErrorMessage("");
    try {
      await takeRunnerQuestLive(questId);
      await refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil quest.");
      throw error;
    } finally {
      setActionQuestId("");
    }
  }, [refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    quests,
    isLoading,
    actionQuestId,
    errorMessage,
    refresh,
    takeQuest,
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
