import { runnerActiveQuests, runnerQuestEscrowFlow } from "../../runner";

export function getRunnerActiveQuestSeed() {
  return {
    quests: runnerActiveQuests,
    escrowFlow: runnerQuestEscrowFlow,
  };
}
