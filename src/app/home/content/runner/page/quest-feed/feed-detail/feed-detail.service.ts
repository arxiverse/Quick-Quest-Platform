import {
  getCachedRunnerQuestFeed,
  runnerQuestFeedSeed,
  type RunnerQuestFeedItem,
} from "../../../runner.service";

export function getRunnerQuestFeedDetailSeed(
  questId: string,
): RunnerQuestFeedItem | null {
  return (
    getCachedRunnerQuestFeed().find((quest) => quest.id === questId) ??
    runnerQuestFeedSeed.find((quest) => quest.id === questId) ??
    null
  );
}
