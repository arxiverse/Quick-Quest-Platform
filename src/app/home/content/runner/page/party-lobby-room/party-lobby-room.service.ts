import {
  getRunnerPartyLobbyInfo,
  runnerPartyLobbyChatMessages,
} from "../../runner";

export function getRunnerPartyLobbyRoomSeed(partyId: string) {
  return {
    partyInfo: getRunnerPartyLobbyInfo(partyId),
    chatMessages: runnerPartyLobbyChatMessages,
  };
}
