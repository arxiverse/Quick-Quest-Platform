import { runnerQuestFeedSeed, type RunnerQuestFeedItem } from "../../runner.service";

export function getRunnerQuestFeedSeed(): RunnerQuestFeedItem[] {
  return runnerQuestFeedSeed;
}

export const RUNNER_QUEST_FEED_SUBVIEW_STORAGE_KEY_SEED =
  "nvrs-qqm-runner-quest-feed-subview-v1";
