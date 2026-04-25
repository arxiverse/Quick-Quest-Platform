import {
  runnerQuestFeedSeed,
  type RunnerQuestFeedItem,
} from "../../../runner.service";

export function getRunnerQuestFeedDetailSeed(
  questId: string,
): RunnerQuestFeedItem | null {
  return runnerQuestFeedSeed.find((quest) => quest.id === questId) ?? null;
}
