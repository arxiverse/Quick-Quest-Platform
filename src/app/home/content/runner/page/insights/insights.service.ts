import {
  runnerAvailabilitySchedule,
  runnerEarningTrajectory,
  runnerFocusInsight,
  runnerMembers,
  runnerReliabilityBadges,
  runnerSkillInventory,
} from "../../runner";

export function getRunnerInsightsSeed() {
  return {
    availability: runnerAvailabilitySchedule,
    earnings: runnerEarningTrajectory,
    focus: runnerFocusInsight,
    members: runnerMembers,
    badges: runnerReliabilityBadges,
    skills: runnerSkillInventory,
  };
}
