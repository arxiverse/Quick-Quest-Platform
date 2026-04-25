import {
  fetchRunnerActiveQuestsFromApi,
  finishRunnerQuestFromApi,
  runnerActiveQuests,
  runnerQuestEscrowFlow,
  startRunnerQuestFromApi,
} from "../../runner.service";

export function getRunnerActiveQuestSeed() {
  return {
    quests: runnerActiveQuests,
    escrowFlow: runnerQuestEscrowFlow,
  };
}

export async function fetchRunnerActiveQuestLive() {
  return fetchRunnerActiveQuestsFromApi();
}

export async function startRunnerActiveQuestLive(questId: string) {
  return startRunnerQuestFromApi(questId);
}

export async function finishRunnerActiveQuestLive(questId: string) {
  return finishRunnerQuestFromApi(questId);
}
