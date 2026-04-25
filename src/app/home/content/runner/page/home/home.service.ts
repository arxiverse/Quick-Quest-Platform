import {
  runnerActiveQuests,
  runnerCareerMetrics,
  runnerOpenParties,
  runnerQuestFeedSeed,
  runnerViewText,
  resolveRunnerFeaturedQuest,
  resolveRunnerPartyHeroParty,
} from "../../runner";

export function getRunnerHomeSeed() {
  return {
    text: runnerViewText.home,
    metrics: runnerCareerMetrics.slice(0, 4),
    activeQuestCount: runnerActiveQuests.length,
    openQuestCount: runnerQuestFeedSeed.length,
    partyLobbyCount: runnerOpenParties.length,
    featuredQuest: resolveRunnerFeaturedQuest(),
    featuredParty: resolveRunnerPartyHeroParty(),
  };
}
