import {
  fetchRunnerBroadcastQuestsFromApi,
  getCachedRunnerQuestFeed,
  getRunnerDeviceLocationRaw,
  takeRunnerQuestFromApi,
  type RunnerQuestFeedItem,
} from "../../runner.service";

export function getRunnerQuestFeedSeed(): RunnerQuestFeedItem[] {
  return getCachedRunnerQuestFeed();
}

export async function fetchRunnerQuestFeedLive(): Promise<RunnerQuestFeedItem[]> {
  try {
    const coords = await getRunnerDeviceLocationRaw();
    return fetchRunnerBroadcastQuestsFromApi(coords);
  } catch {
    return fetchRunnerBroadcastQuestsFromApi();
  }
}

export async function takeRunnerQuestLive(questId: string): Promise<void> {
  await takeRunnerQuestFromApi(questId);
}

export const RUNNER_QUEST_FEED_SUBVIEW_STORAGE_KEY_SEED =
  "nvrs-qqm-runner-quest-feed-subview-v1";
